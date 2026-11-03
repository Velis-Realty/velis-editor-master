#!/usr/bin/env node
// Kiểm máy đã đủ đồ để dựng video chưa: npm run kiem-may
//   In ✔ / ✘ từng mục, mục thiếu thì in luôn lệnh sửa theo hệ điều hành. Chỉ đọc, không cài gì.
//   Thoát mã 1 khi thiếu mục bắt buộc. Cài thì dùng: bash scripts/cai-dat.sh
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const require = createRequire(path.join(ROOT, "package.json"));
const HE = process.platform === "darwin" ? "mac" : fs.existsSync("/proc/sys/fs/binfmt_misc/WSLInterop") || /microsoft/i.test(os.release()) ? "wsl" : process.platform === "linux" ? "linux" : "khac";
const CLOUD = process.env.CLAUDE_CODE_REMOTE === "true";
const sua = (mac, linux) => (HE === "mac" ? mac : linux);
const chay = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: "utf8" }); return r.status === 0 ? (r.stdout || r.stderr).trim() : null; };
const ASR_PY = path.join(os.homedir(), ".asr", "bin", "python");

const muc = [];
const kiem = (ten, batBuoc, fn) => { let r; try { r = fn(); } catch (e) { r = { ok: false, loi: e.message }; } muc.push({ ten, batBuoc, ...r }); };

kiem("Node.js 22+", true, () => {
  const v = Number(process.versions.node.split(".")[0]);
  return v >= 22 ? { ok: true, ghi: `v${process.versions.node}` } : { ok: false, ghi: `đang là v${process.versions.node}`, sua: sua("brew install node@22", "nvm install 22 && nvm use 22") };
});
kiem("FFmpeg + FFprobe", true, () => {
  const f = chay("ffmpeg", ["-version"]), p = chay("ffprobe", ["-version"]);
  return f && p ? { ok: true, ghi: f.split("\n")[0].split(" ").slice(0, 3).join(" ") } : { ok: false, sua: sua("brew install ffmpeg", "sudo apt install -y ffmpeg") };
});
kiem("Thư viện Node (npm install)", true, () => {
  const thieu = ["hyperframes", "playwright", "gsap"].filter((m) => { try { require.resolve(`${m}/package.json`); return false; } catch { return true; } });
  return thieu.length ? { ok: false, ghi: `thiếu ${thieu.join(", ")}`, sua: "npm install" } : { ok: true, ghi: `hyperframes ${require("hyperframes/package.json").version}` };
});
kiem("Trình duyệt Chromium (Playwright)", true, () => {
  if (process.env.PW_CHROMIUM && fs.existsSync(process.env.PW_CHROMIUM)) return { ok: true, ghi: process.env.PW_CHROMIUM };
  if (fs.existsSync("/opt/pw-browsers/chromium")) return { ok: true, ghi: "/opt/pw-browsers/chromium" };
  let p; try { p = require("playwright").chromium.executablePath(); } catch { return { ok: false, ghi: "chưa có playwright", sua: "npm install" }; }
  return p && fs.existsSync(p) ? { ok: true, ghi: "Chromium của Playwright" } : { ok: false, sua: `npx playwright install ${HE === "mac" ? "" : "--with-deps "}chromium` };
});
kiem("Python ~/.asr (nhận diện giọng, tách người)", true, () => {
  if (!fs.existsSync(ASR_PY)) return { ok: false, ghi: "chưa có ~/.asr", sua: "bash scripts/cai-dat.sh" };
  const r = spawnSync(ASR_PY, ["-I", "-c", "import faster_whisper, numpy, imageio, PIL, rembg, cv2"], { encoding: "utf8" });
  if (r.status === 0) return { ok: true, ghi: chay(ASR_PY, ["--version"]) || "" };
  const m = (r.stderr.match(/No module named '([^']+)'/) || [])[1];
  return { ok: false, ghi: m ? `thiếu gói ${m}` : "lỗi import", sua: "VIRTUAL_ENV=~/.asr uv pip install -r scripts/asr/requirements.txt" };
});
kiem("Git: tên + email", false, () => {
  const n = chay("git", ["config", "user.name"]), e = chay("git", ["config", "user.email"]);
  return n && e ? { ok: true, ghi: `${n} <${e}>` } : { ok: false, sua: 'git config --global user.name "Tên" && git config --global user.email "email-github@..."' };
});
if (!CLOUD) kiem("Claude Code", false, () => {
  const v = chay("claude", ["--version"]);
  return v ? { ok: true, ghi: v } : { ok: false, sua: "curl -fsSL https://claude.ai/install.sh | bash" };
});
kiem("Ổ trống ≥ 10 GB", false, () => {
  const s = fs.statfsSync(ROOT), gb = (s.bavail * s.bsize) / 1e9;
  return gb >= 10 ? { ok: true, ghi: `${gb.toFixed(0)} GB` } : { ok: false, ghi: `còn ${gb.toFixed(1)} GB`, sua: "dọn work/ và build/ của video đã giao" };
});
if (HE === "wsl" && ROOT.startsWith("/mnt/")) muc.push({ ten: "Vị trí repo", batBuoc: false, ok: false, ghi: `đang ở ${ROOT}`, sua: "chép repo vào ~ của Ubuntu (để trong /mnt/c chạy rất chậm)" });

console.log(`\nKiểm máy dựng video · ${{ mac: "macOS", linux: "Linux", wsl: "Windows (WSL)", khac: process.platform }[HE]}${CLOUD ? " · cloud" : ""}\n`);
for (const m of muc) {
  console.log(`  ${m.ok ? "✔" : m.batBuoc ? "✘" : "!"} ${m.ten}${m.ghi ? `  (${m.ghi})` : ""}`);
  if (!m.ok && m.sua) console.log(`      → ${m.sua}`);
  if (!m.ok && m.loi) console.log(`      lỗi: ${m.loi}`);
}
const thieu = muc.filter((m) => !m.ok && m.batBuoc);
if (thieu.length) {
  console.log(`\n✘ Thiếu ${thieu.length} mục bắt buộc. Cách nhanh nhất: bash scripts/cai-dat.sh (hoặc chạy từng lệnh → ở trên).\n`);
  process.exit(1);
}
console.log(`\n✔ Máy đã sẵn sàng. Thử: npm run example  ·  Làm video: claude rồi nói "edit video cho anh X, clip ở work/<ten-video>/"\n`);
