# -*- coding: utf-8 -*-
"""Swap 发音要点 column before 示例单词 column in Vowels.html."""
import re
import io

p = r"D:\MyProject\EnglishLearn\phonetics\Vowels.html"
s = io.open(p, encoding="utf-8").read()

n_headers = s.count("<th>音标</th><th>示例单词（完整音标）</th><th>发音要点</th>")
s = s.replace(
    "<th>音标</th><th>示例单词（完整音标）</th><th>发音要点</th>",
    "<th>音标</th><th>发音要点</th><th>示例单词（完整音标）</th>",
)

# Swap cells: ipa, word, plain -> ipa, plain, word (only rows where word directly follows ipa)
s2, n_rows = re.subn(
    r'(<td class="ipa">.*?</td>)(<td class="word">.*?</td>)(<td>.*?</td></tr>)',
    r"\1\3\2",
    s,
    flags=re.S,
)

io.open(p, "w", encoding="utf-8").write(s2)
io.open(r"D:\MyProject\EnglishLearn\.workbuddy\tmp\check.txt", "w", encoding="utf-8").write(
    "headers_swapped: %d, rows_swapped: %d" % (n_headers, n_rows)
)
