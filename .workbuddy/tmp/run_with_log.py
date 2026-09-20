# -*- coding: utf-8 -*-
"""Rerun generator, capture traceback to a UTF-8 file (PowerShell redirect is UTF-16)."""
import io
import os
import sys
import traceback

log = io.open(r"D:\MyProject\EnglishLearn\.workbuddy\tmp\err.txt", "w", encoding="utf-8")
sys.stdout = log
sys.stderr = log

try:
    exec(io.open(r"D:\MyProject\EnglishLearn\.workbuddy\tmp\gen_phoneme_audio.py", encoding="utf-8").read())
except Exception:
    traceback.print_exc()
finally:
    log.close()
