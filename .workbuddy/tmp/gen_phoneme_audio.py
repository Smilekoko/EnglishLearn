# -*- coding: utf-8 -*-
"""Download IPA vowel recordings from Wikimedia Commons and build
phoneme-only MP3s. Diphthongs are built by concatenating two vowel
recordings (glide from first to second)."""
import json
import os
import shutil
import subprocess
import tempfile
import time
import urllib.parse
import urllib.request
import wave

import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
AUDIO_DIR = r"D:\MyProject\EnglishLearn\phonetics\audio"
UA = {"User-Agent": "EnglishLearnProject/1.0 (personal learning use)"}

# Commons recording titles for each IPA vowel symbol
MONOPHTHONGS = {
    "vowel_ee.mp3": "Close front unrounded vowel.ogg",          # /iː/
    "vowel_ih.mp3": "Near-close near-front unrounded vowel.ogg", # /ɪ/
    "vowel_e.mp3": "Close-mid front unrounded vowel.ogg",        # /e/
    "vowel_ae.mp3": "Near-open front unrounded vowel.ogg",       # /æ/
    "vowel_uh.mp3": "Open-mid back unrounded vowel.ogg",         # /ʌ/
    "vowel_oh.mp3": "Open back rounded vowel.ogg",               # /ɒ/
    "vowel_oo.mp3": "Close back rounded vowel.ogg",              # /uː/
    "vowel_u.mp3": "Near-close near-back rounded vowel.ogg",     # /ʊ/
    "vowel_schwa.mp3": "Mid central vowel.ogg",                  # /ə/
    "vowel_er.mp3": "Mid central vowel.ogg",                     # /ɜː/ (long mid-central)
    "vowel_ah.mp3": "Open back unrounded vowel.ogg",             # /ɑː/
    "vowel_aw.mp3": "Open-mid back rounded vowel.ogg",           # /ɔː/
    "vowel_a.mp3": "Open front unrounded vowel.ogg",             # [a] for diphthongs
}

# Diphthong output -> (start vowel key without extension, end vowel)
DIPHTHONGS = {
    "vowel_ay.mp3": ("vowel_e", "vowel_ih"),      # /eɪ/  e -> ɪ
    "vowel_ai.mp3": ("vowel_a", "vowel_ih"),      # /aɪ/  a -> ɪ
    "vowel_oy.mp3": ("vowel_aw", "vowel_ih"),     # /ɔɪ/  ɔ -> ɪ
    "vowel_au.mp3": ("vowel_a", "vowel_u"),       # /aʊ/  a -> ʊ
    "vowel_ou.mp3": ("vowel_schwa", "vowel_u"),   # /əʊ/  ə -> ʊ
    "vowel_ia.mp3": ("vowel_ih", "vowel_schwa"),  # /ɪə/  ɪ -> ə
    "vowel_ea.mp3": ("vowel_e", "vowel_schwa"),   # /eə/  e -> ə
    "vowel_ua.mp3": ("vowel_u", "vowel_schwa"),   # /ʊə/  ʊ -> ə
}


def get_file_url(title):
    """Compute the direct upload.wikimedia.org URL from the md5 of the
    normalized filename (no API round-trip needed), with retries."""
    import hashlib
    name = title.replace(" ", "_")
    h = hashlib.md5(name.encode("utf-8")).hexdigest()
    url = f"https://upload.wikimedia.org/wikipedia/commons/{h[0]}/{h[:2]}/{urllib.parse.quote(name)}"
    for attempt in range(1, 6):
        try:
            req = urllib.request.Request(url, method="HEAD", headers=UA)
            with urllib.request.urlopen(req, timeout=60) as r:
                if r.status == 200:
                    return url
        except Exception as exc:
            print(f"  HEAD check attempt {attempt} failed: {exc}")
            time.sleep(2 * attempt)
    return url  # try anyway


def download(title, dest_ogg, retries=8):
    src = get_file_url(title)
    for attempt in range(1, retries + 1):
        try:
            req = urllib.request.Request(src, headers=UA)
            with urllib.request.urlopen(req, timeout=90) as r, open(dest_ogg, "wb") as f:
                f.write(r.read())
            return
        except Exception as exc:
            print(f"  download attempt {attempt} failed: {exc}")
            if attempt == retries:
                raise
            time.sleep(3 * attempt)


def to_wav(src, dest_wav):
    subprocess.run(
        [FFMPEG, "-y", "-loglevel", "error", "-i", src,
         "-ar", "44100", "-ac", "1", "-sample_fmt", "s16", dest_wav],
        check=True,
    )


def to_mp3(src, dest_mp3, bitrate="128k"):
    subprocess.run(
        [FFMPEG, "-y", "-loglevel", "error", "-i", src,
         "-codec:a", "libmp3lame", "-b:a", bitrate, dest_mp3],
        check=True,
    )


def concat_wavs(paths, dest_wav, gap_ms=40):
    """Concatenate wav files with a tiny gap so the glide is audible."""
    out = None
    silence = b"\x00\x00" * int(44100 * gap_ms / 1000)
    params = None
    frames = []
    for p in paths:
        with wave.open(p, "rb") as w:
            if params is None:
                params = w.getparams()
            frames.append(w.readframes(w.getnframes()))
    with wave.open(dest_wav, "wb") as w:
        w.setparams(params)
        for i, fr in enumerate(frames):
            if i > 0:
                w.writeframes(silence)
            w.writeframes(fr)


def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    tmp = r"D:\MyProject\EnglishLearn\.workbuddy\tmp\ogg_cache"
    os.makedirs(tmp, exist_ok=True)
    wav_cache = {}
    failures = []

    jobs = sorted(MONOPHTHONGS.items(), key=lambda kv: kv[0])
    for out_name, title in jobs:
        try:
            ogg = os.path.join(tmp, title.replace(" ", "_") + ".ogg")
            if not os.path.exists(ogg):
                print("downloading", title, flush=True)
                download(title, ogg)
            wav = os.path.join(tmp, title.replace(" ", "_") + ".wav")
            if not os.path.exists(wav):
                to_wav(ogg, wav)
            wav_cache[out_name[:-4]] = wav
            if out_name == "vowel_er.mp3":
                # reuse the schwa recording for /ɜː/ (long mid-central vowel)
                subprocess.run([FFMPEG, "-y", "-loglevel", "error", "-i", wav,
                                "-af", "atempo=0.85", "-codec:a", "libmp3lame",
                                "-b:a", "128k", os.path.join(AUDIO_DIR, out_name)],
                               check=True)
            else:
                to_mp3(wav, os.path.join(AUDIO_DIR, out_name))
            print("built", out_name, flush=True)
        except Exception as exc:
            failures.append((out_name, repr(exc)))
            print("FAILED", out_name, repr(exc), flush=True)

    for out_name, (start, end) in DIPHTHONGS.items():
        try:
            joined = os.path.join(tmp, out_name[:-4] + ".wav")
            concat_wavs([wav_cache[start], wav_cache[end]], joined)
            to_mp3(joined, os.path.join(AUDIO_DIR, out_name))
            print("built", out_name, flush=True)
        except Exception as exc:
            failures.append((out_name, repr(exc)))
            print("FAILED", out_name, repr(exc), flush=True)

    print("FAILURES:", failures, flush=True)
    print("ALL DONE", flush=True)


if __name__ == "__main__":
    main()
