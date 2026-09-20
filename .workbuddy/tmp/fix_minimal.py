# -*- coding: utf-8 -*-
"""Rebuild the minimal-pairs table section cleanly."""
import re
import io

p = r"D:\MyProject\EnglishLearn\phonetics\Vowels.html"
s = io.open(p, encoding="utf-8").read()

new_block = """  <table>
    <tr><th>对比组</th><th>区别</th><th>示例</th></tr>
    <tr><td class="ipa"><span class="ipa-text">/ɪ/</span><button class="play-btn" data-src="audio/vowel_ih.mp3">▶</button> vs <span class="ipa-text">/iː/</span><button class="play-btn" data-src="audio/vowel_ee.mp3">▶</button></td><td>短促放松 vs 拉长紧张</td><td class="word">ship <span class="ipa-trans">/ʃ<span class="hi">ɪ</span>p/</span> vs sheep <span class="ipa-trans">/ʃ<span class="hi">iː</span>p/</span></td></tr>
    <tr><td class="ipa"><span class="ipa-text">/æ/</span><button class="play-btn" data-src="audio/vowel_ae.mp3">▶</button> vs <span class="ipa-text">/e/</span><button class="play-btn" data-src="audio/vowel_e.mp3">▶</button></td><td>口张大 vs 口半开</td><td class="word">bad <span class="ipa-trans">/b<span class="hi">æ</span>d/</span> vs bed <span class="ipa-trans">/b<span class="hi">e</span>d/</span></td></tr>
    <tr><td class="ipa"><span class="ipa-text">/ʌ/</span><button class="play-btn" data-src="audio/vowel_uh.mp3">▶</button> vs <span class="ipa-text">/ɑː/</span><button class="play-btn" data-src="audio/vowel_ah.mp3">▶</button></td><td>短促自然 vs 长且口大</td><td class="word">cup <span class="ipa-trans">/k<span class="hi">ʌ</span>p/</span> vs card <span class="ipa-trans">/k<span class="hi">ɑː</span>d/</span></td></tr>
    <tr><td class="ipa"><span class="ipa-text">/ʊ/</span><button class="play-btn" data-src="audio/vowel_u.mp3">▶</button> vs <span class="ipa-text">/uː/</span><button class="play-btn" data-src="audio/vowel_oo.mp3">▶</button></td><td>短促放松 vs 拉长圆唇</td><td class="word">full <span class="ipa-trans">/f<span class="hi">ʊ</span>l/</span> vs fool <span class="ipa-trans">/f<span class="hi">uː</span>l/</span></td></tr>
    <tr><td class="ipa"><span class="ipa-text">/ɒ/</span><button class="ipa"></span></td></tr>
  </table>"""

# placeholder wrong; build properly below
new_block = """  <table>
    <tr><th>对比组</th><th>区别</th><th>示例</th></tr>
    <tr><td class="ipa"><span class="ipa-text">/ɪ/</span><button class="play-btn" data-src="audio/vowel_ih.mp3">▶</button> vs <span class="ipa-text">/iː/</span><button class="play-btn" data-src="audio/vowel_ee.mp3">▶</button></td><td>短促放松 vs 拉长紧张</td><td class="word">ship <span class="ipa-trans">/ʃ<span class="hi">ɪ</span>p/</span> vs sheep <span class="ipa-trans">/ʃ<span class="hi">iː</span>p/</span></td></tr>
    <tr><td class="ipa"><span class="ipa-text">/æ/</span><button class="play-btn" data-src="audio/vowel_ae.mp3">▶</button> vs <span class="ipa-text">/e/</span><button class="play-btn" data-src="audio/vowel_e.mp3">▶</button></td><td>口张大 vs 口半开</td><td class="word">bad <span class="ipa-trans">/b<span class="hi">æ</span>d/</span> vs bed <span class="ipa-trans">/b<span class="hi">e</span>d/</span></td></tr>
    <tr><td class="ipa"><span class="ipa-text">/ʌ/</span><button class="play-btn" data-src="audio/vowel_uh.mp3">▶</button> vs <span class="ipa-text">/ɑː/</span><button class="play-btn" data-src="audio/vowel_ah.mp3">▶</button></td><td>短促自然 vs 长且口大</td><td class="word">cup <span class="ipa-trans">/k<span class="hi">ʌ</span>p/</span> vs card <span class="ipa-trans">/k<span class="hi">ɑː</span>d/</span></td></tr>
    <tr><td class="ipa"><span class="ipa-text">/ʊ/</span><button class="play-btn" data-src="audio/vowel_u.mp3">▶</button> vs <span class="ipa-text">/uː/</span><button class="play-btn" data-src="audio/vowel_oo.mp3">▶</button></td><td>短促放松 vs 拉长圆唇</td><td class="word">full <span class="ipa-trans">/f<span class="hi">ʊ</span>l/</span> vs fool <span class="ipa-trans">/f<span class="hi">uː</span>l/</span></td></tr>
    <tr><td class="ipa"><span class="ipa-text">/ɒ/</span><button class="play-btn" data-src="audio/vowel_oh.mp3">▶</button> vs <span class="ipa-text">/ɔː/</span><button class="play-btn" data-src="audio/vowel_aw.mp3">▶</button></td><td>短促圆唇 vs 长音且更圆</td><td class="word">pot <span class="ipa-trans">/p<span class="hi">ɒ</span>t/</span> vs port <span class="ipa-trans">/p<span class="hi">ɔː</span>t/</span></td></tr>
  </table>"""

# Replace from the 三 heading through its closing </table>
pattern = re.compile(r'  <h2>三、易混淆元音对比（最小对立对 Minimal Pairs）</h2>\n  <table>.*?</table>', re.S)
s2, n = pattern.subn(lambda m: '  <h2>三、易混淆元音对比（最小对立对 Minimal Pairs）</h2>\n' + new_block, s)
assert n == 1, "section not found: %d" % n

io.open(p, "w", encoding="utf-8").write(s2)

# Final structural sanity check
ok = all(c == 0 for c in [s2.count("</tr></tr>"), s2.count('</tr><td')])
words_last = len(re.findall(r'<td class="word">.*?</td></tr>', s2, flags=re.S))
io.open(r"D:\MyProject\EnglishLearn\.workbuddy\tmp\check.txt", "w", encoding="utf-8").write(
    "replaced: %d, double_close_tr: %d, stray_tr_td: %d, rows_with_word_last: %d"
    % (n, s2.count("</tr></tr>"), s2.count("</tr><td"), words_last)
)
