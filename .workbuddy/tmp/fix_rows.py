# -*- coding: utf-8 -*-
"""Repair row structure: move </tr> back after the word cell."""
import re
import io

p = r"D:\MyProject\EnglishLearn\phonetics\Vowels.html"
s = io.open(p, encoding="utf-8").read()

# broken:  ...要点</td></tr><td class="word">X</td>\n<tr>
# fixed:   ...要点</td><td class="word">X</td></tr>
s2, n = re.subn(r'</tr><td class="word">(.*?)</td>', r'<td class="word">\1</td></tr>', s, flags=re.S)

io.open(p, "w", encoding="utf-8").write(s2)

# sanity check: every row should be ipa td, plain td, word td, then </tr>
bad = re.findall(r'</tr>(?!\s*(?:<tr>|</table>|<div))', s2)
rows_ok = len(re.findall(r'</td><td class="word">.*?</td></tr>', s2, flags=re.S))
io.open(r"D:\MyProject\EnglishLearn\.workbuddy\tmp\check.txt", "w", encoding="utf-8").write(
    "repaired: %d, rows_with_word_last: %d, stray_close_tr: %d" % (n, rows_ok, len(bad))
)
