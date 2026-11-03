#!/usr/bin/env node
// Tải clip + tài liệu khách gửi về đúng chỗ: npm run tai-clip -- <link> <khach>-<du-an>
//   Link: thư mục / file Google Drive (để "Bất kỳ ai có đường liên kết"), Dropbox, hoặc link tải thẳng. Nhiều link thì ghi nhiều lần.
//   → work/<video>/00_tai-ve/ (chưa có projects/<video>/ thì tạo bằng scripts/new-video.mjs).
//   Ảnh, PDF, bảng tính chép sang work/<video>/03_assets/. In bảng clip (thời lượng, khung, có tiếng không) để xếp vào
//   01_footage/cam_a · cam_b · drone · broll và 02_audio/voiceover rồi chạy lib/ingest.mjs (VAN-HANH mục 3).
//   Google Drive dùng gdown trong ~/.asr (scripts/asr/requirements.txt). Không commit gì: work/ đã gitignore.
import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { probe } from "../lib/ingest.mjs";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const [link, slug] = process.argv.slice(2).filter((x) => !x.startsWith("--"));
const thoat = (m) => { console.error(`✘ ${m}`); process.exit(1); };
if (!link || !slug) thoat("Cách dùng: npm run tai-clip -- <link Google Drive / Dropbox / URL> <khach>-<du-an>");
if (!/^[a-z0-9-]+$/.test(slug)) thoat(`Tên video "${slug}" chỉ được chữ thường không dấu, số, gạch nối (vd tuan-sunrise)`);
if (!fs.existsSync(path.join(ROOT, "projects", slug))) execFileSync("node", [path.join(ROOT, "scripts/new-video.mjs"), slug], { stdio: "inherit" });

const W = path.join(ROOT, "work", slug), DL = path.join(W, "00_tai-ve");
fs.mkdirSync(DL, { recursive: true });
const truoc = new Set(liet(DL));
const GDOWN = path.join(os.homedir(), ".asr", "bin", "gdown");

function liet(d) { return fs.existsSync(d) ? fs.readdirSync(d, { recursive: true }).map(String).filter((f) => fs.statSync(path.join(d, f)).isFile()) : []; }
function chay(cmd, args) { const r = spawnSync(cmd, args, { stdio: "inherit", cwd: DL }); if (r.status !== 0) thoat(`${cmd} lỗi (mã ${r.status}). Link đã để "Bất kỳ ai có đường liên kết" chưa? Network môi trường đã Full chưa?`); }

if (/drive\.google\.com|docs\.google\.com/.test(link)) {
  if (!fs.existsSync(GDOWN)) thoat("Chưa có gdown. Cloud: chạy lại .claude/hooks/session-start.sh · Máy mình: bash scripts/cai-dat.sh");
  // gdown tự nhận link thư mục / file; -c bỏ qua file đã tải xong khi chạy lại, --retries nối tiếp khi mạng chập chờn
  chay(GDOWN, [link, "-O", DL + path.sep, "-c", "--retries", "3", "--timeout", "120"]);
} else {
  let url = link;
  if (/dropbox\.com/.test(url)) url = url.replace(/([?&])dl=0/, "$1dl=1") + (/[?&]dl=1/.test(url) ? "" : (url.includes("?") ? "&" : "?") + "dl=1");
  const ten = decodeURIComponent(new URL(link).pathname.split("/").pop() || "tai-ve") || "tai-ve";
  chay("curl", ["-fsSL", "--retry", "3", "-o", ten.replace(/[^\w.\-]+/g, "_"), url]);
  // Dropbox thư mục tải về dạng .zip
  for (const f of liet(DL).filter((f) => !truoc.has(f) && /\.zip$/i.test(f))) { chay("unzip", ["-oq", f]); fs.rmSync(path.join(DL, f)); }
}

const moi = liet(DL).filter((f) => !truoc.has(f) && !f.startsWith("__MACOSX"));
if (!moi.length) thoat("Không tải được file nào.");
const VIDEO = /\.(mp4|mov|mxf|mts|m4v|avi|mkv)$/i, AUDIO = /\.(wav|mp3|m4a|aac|flac|aif|aiff)$/i, TAI_LIEU = /\.(pdf|jpe?g|png|webp|heic|svg|xlsx?|csv|docx?|pptx?|txt)$/i;
const bang = [], loi = [];
for (const f of moi.sort()) {
  const p = path.join(DL, f), kb = fs.statSync(p).size / 1024;
  const dau = fs.readFileSync(p, { encoding: "latin1" }).slice(0, 200).toLowerCase();
  if (kb < 500 && /<!doctype html|<html/.test(dau)) { loi.push(`${f}: là trang HTML, không phải file (link chưa chia sẻ công khai hoặc cần xác nhận tải), đã xóa`); fs.rmSync(p); continue; }
  if (TAI_LIEU.test(f)) { fs.mkdirSync(path.join(W, "03_assets"), { recursive: true }); fs.copyFileSync(p, path.join(W, "03_assets", path.basename(f))); bang.push(`  tài liệu  ${f} → 03_assets/`); continue; }
  if (VIDEO.test(f) || AUDIO.test(f)) {
    try {
      const m = probe(p);
      bang.push(`  ${VIDEO.test(f) ? "clip    " : "âm thanh"}  ${f}  ${m.dur.toFixed(1)} s${m.w ? `  ${m.w}×${m.h} ${m.w < m.h ? "dọc" : "ngang"} ${m.fps} fps ${m.bits}-bit${m.log ? " " + m.log.toUpperCase() : ""}` : ""}  ${m.audio ? "có tiếng" : "không tiếng"}`);
    } catch { loi.push(`${f}: ffprobe không đọc được (file hỏng hoặc tải dở)`); }
    continue;
  }
  bang.push(`  khác      ${f}`);
}
const GB = moi.reduce((s, f) => s + fs.statSync(path.join(DL, f)).size, 0) / 1e9;
if (bang.length) console.log(`\n✔ Tải ${bang.length} file (${GB.toFixed(2)} GB) vào ${path.relative(ROOT, DL)}/\n${bang.join("\n")}`);
if (loi.length) console.log(`\n✘ Lỗi:\n  ${loi.join("\n  ")}`);
console.log(`\nTiếp: xếp clip người nói vào 01_footage/cam_a (máy phụ cam_b), cảnh dự án vào broll / drone, mic rời vào 02_audio/voiceover,\nrồi node lib/ingest.mjs projects/${slug}`);
if (loi.length) process.exit(1);
