#!/usr/bin/env python3
"""Tải sẵn model cho ~/.asr để lúc dựng không phải chờ: ~/.asr/bin/python -I scripts/asr/tai-model.py

- faster-whisper large-v3 (~3 GB, scripts/asr/transcribe.py) vào bộ nhớ đệm Hugging Face.
- rembg u2net_human_seg (~170 MB, scripts/fx/matte.py: tách người cho chữ sau người) vào ~/.rembg/models.
Có rồi thì bỏ qua. .claude/hooks/session-start.sh chạy file này ở chế độ nền khi mở phiên cloud; log ở ~/.asr/tai-model.log.
"""
import sys, time

t = time.time()
from faster_whisper.utils import download_model
print("whisper large-v3:", download_model("large-v3"), flush=True)
from rembg import new_session
new_session("u2net_human_seg")
print(f"rembg u2net_human_seg: xong · {time.time() - t:.0f} s", flush=True)
print("XONG", flush=True)
