#!/usr/bin/env bash
# Cài mọi thứ để dựng video trên máy của mình, một lệnh: bash scripts/cai-dat.sh
#   macOS (cần Homebrew), Linux Ubuntu/Debian, Windows qua WSL2 (Ubuntu).
#   Cài: FFmpeg, Python, Node 22 (khi thiếu) · uv · node_modules · Python ~/.asr (scripts/asr/requirements.txt)
#   · Chromium cho Playwright. Xong thì kiểm máy (scripts/kiem-may.mjs) và dựng thử tests/demo (không render).
#   Chạy lại bao nhiêu lần cũng được: phần đã có thì bỏ qua.
#   Trên cloud không cần: .claude/hooks/session-start.sh tự cài khi mở phiên.
set -euo pipefail
cd "$(dirname "$0")/.."

xanh() { printf '\n\033[1;32m▶ %s\033[0m\n' "$*"; }
loi() { printf '\n\033[1;31m✘ %s\033[0m\n' "$*" >&2; exit 1; }
co() { command -v "$1" >/dev/null 2>&1; }
node_du() { co node && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge 22 ]; }

case "$(uname -s)" in
  Darwin) HE=mac ;;
  Linux) HE=linux ;;
  *) loi "Hệ điều hành này chưa hỗ trợ. Windows: cài WSL2 (PowerShell Administrator: wsl --install -d Ubuntu), mở app Ubuntu rồi chạy lại lệnh này trong đó." ;;
esac
[[ "$PWD" == /mnt/* ]] && echo "⚠ Repo đang nằm trong ổ Windows ($PWD), sẽ chạy rất chậm. Nên clone lại vào ~ của Ubuntu."

# Nạp nvm / uv nếu đã cài ở lần trước
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"; [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"

xanh "1/6 Công cụ hệ thống (git, ffmpeg, python3, Node 22)"
if [ "$HE" = mac ]; then
  co brew || loi 'Chưa có Homebrew. Cài bằng lệnh sau rồi chạy lại:
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
  thieu=(); co git || thieu+=(git); co ffmpeg || thieu+=(ffmpeg); co python3 || thieu+=(python); node_du || thieu+=(node@22)
  if [ ${#thieu[@]} -gt 0 ]; then brew install "${thieu[@]}"; fi
  node_du || { brew link --overwrite --force node@22 || true; export PATH="$(brew --prefix node@22)/bin:$PATH"; }
else
  thieu=(); co git || thieu+=(git); co ffmpeg || thieu+=(ffmpeg); co python3 || thieu+=(python3); co curl || thieu+=(curl)
  python3 -c 'import venv' 2>/dev/null || thieu+=(python3-venv)
  if [ ${#thieu[@]} -gt 0 ]; then
    co apt-get || loi "Thiếu ${thieu[*]}. Máy không có apt: tự cài các gói này rồi chạy lại."
    echo "Cần cài: ${thieu[*]} (có thể hỏi mật khẩu máy)"
    SUDO=""; [ "$(id -u)" -ne 0 ] && SUDO=sudo
    $SUDO apt-get update -qq && $SUDO apt-get install -y -qq "${thieu[@]}"
  fi
  if ! node_du; then
    [ -s "$NVM_DIR/nvm.sh" ] || { curl -fsSL -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash; . "$NVM_DIR/nvm.sh"; }
    nvm install 22 && nvm alias default 22
  fi
fi
node_du || loi "Chưa có Node 22+. Mở Terminal mới rồi chạy lại lệnh này."
echo "git $(git --version | cut -d' ' -f3) · $(ffmpeg -version | head -1 | cut -d' ' -f1-3) · $(python3 --version) · node $(node -v)"

xanh "2/6 uv (cài gói Python nhanh)"
if ! co uv; then
  if [ "$HE" = mac ]; then brew install uv; else curl -LsSf https://astral.sh/uv/install.sh | sh; fi
  export PATH="$HOME/.local/bin:$HOME/.cargo/bin:$PATH"
fi
uv --version

xanh "3/6 Thư viện Node (npm install)"
npm install --no-audit --no-fund

xanh "4/6 Python ~/.asr: nhận diện giọng, tách người (lần đầu vài phút)"
ASR="$HOME/.asr"
[ -x "$ASR/bin/python" ] || uv venv -q "$ASR"
VIRTUAL_ENV="$ASR" uv pip install -q -r scripts/asr/requirements.txt
echo "xong: $ASR"

xanh "5/6 Trình duyệt Chromium cho Playwright"
if [ -n "${PW_CHROMIUM:-}" ] || [ -e /opt/pw-browsers/chromium ] || node -e 'process.exit(require("fs").existsSync(require("playwright").chromium.executablePath())?0:1)' 2>/dev/null; then
  echo "đã có"
elif [ "$HE" = mac ]; then npx playwright install chromium
else npx playwright install --with-deps chromium
fi

xanh "6/6 Kiểm máy và dựng thử (tests/demo, không render)"
node scripts/kiem-may.mjs
npm run demo --silent >/dev/null && echo "✔ Dựng thử đạt."

cat <<'EOF'

Xong. Các bước tiếp:
  1. Thử một video mẫu hoàn chỉnh (vài phút):   npm run example   → build/example/output.mp4
  2. Tạo chỗ để clip cho video mới:             npm run new -- tuan-sunrise
     rồi chép clip người nói vào work/tuan-sunrise/01_footage/cam_a/, cảnh dự án vào .../broll/
  3. Mở Claude và giao việc:                     claude
     "Edit video tuan-sunrise cho anh Tuấn, dự án Sunrise. Clip ở work/tuan-sunrise/. CTA: Nhắn anh Tuấn nhận bảng giá."
EOF
