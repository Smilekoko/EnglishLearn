package com.koko.englishlearn.data

//region 元音部分 (Vowels)
//单元音(短元音) 7个
const val Vowels_ɪ = "ɪ"//sit /sɪt/ 嘴唇扁平、肌肉放松、短促地发出介于‘一’和‘呃’之间的声音。
const val Vowels_e = "e"//bed /bed/ 张开一指宽，嘴角微微咧，干脆利落地发一个‘哎’（去尾音）。
const val Vowels_æ = "æ"//cat
const val Vowels_uk_ɒ = "ɒ"//hot,读起来像 "霍特"（偏“奥”的音）
const val Vowels_us_ɑ = "ɑ"//hot,读起来像 "哈特"（偏“啊”的音）
const val Vowels_ʌ = "ʌ"//run
const val Vowels_ʊ = "ʊ"//put
const val Vowels_ə = "ə"//away

//单元音(长元音) 5个
const val Vowels_iː = "iː"//see
const val Vowels_ɑː = "ɑː"//father
const val Vowels_ɔː = "ɔː"//water /ˈwɔːtər/
const val Vowels_uː = "uː"//too
const val Vowels_uk_ɜː = "ɜː"//bird /bɜːd/
const val Vowels_us_ɝ = "ɝ"//bird /bɝd/ 卷舌（儿化）

//双元音 8个
const val Vowels_eɪ = "eɪ" //say
const val Vowels_aɪ = "aɪ"//my
const val Vowels_ɔɪ = "aɪ"//boy
const val Vowels_uk_əʊ = "əʊ"//go 由扁变圆
const val Vowels_us_oʊ = "oʊ"//go 自始至终都是圆的
const val Vowels_aʊ = "aʊ" //now
const val Vowels_uk_ɪə = "ɪə" // near 完全不卷舌。从短促的“一”流畅地滑向放松的“额”。听起来就像中文里的 “一-额” 连读。
const val Vowels_us_ɪr = "ɪr" // near 浓浓的儿化音。刚发出“一”的音，舌头立刻向后缩、舌尖向上卷，带出强大的 “儿” 音。
const val Vowels_uk_eə = "eə"//hair 完全不卷舌。从“哎”流畅地滑向放松的短音“额”,听起来就像中文里叹气的 “哎-额” 连读。
const val Vowels_us_ɛr = "ɛr"//hair 带有浓重的儿化音。刚发出“哎”的音，舌头立刻向后缩、舌尖向上翘起，顺滑地变成 “儿”。听起来就像 “哎-儿”
const val Vowels_uk_ʊə = "ʊə"//poor 完全不卷舌。从短促放松的“乌”顺滑地滑向“额”。听起来就像中文里的 “乌-额” 连读。
const val Vowels_us_ʊr = "ʊr"//poor 带有美式卷舌音。发出“乌”的音之后，舌头立刻向后缩、舌尖向上翘，顺滑地变成 “儿”。听起来就像 “乌-儿”。

//endregion


//region 辅音部分 (Consonants)
//清辅音：p, t, k, f, θ (think), s, ʃ (she), h, tʃ (choose), tr, ts
const val Consonants_p = "p"
const val Consonants_t = "t"
const val Consonants_k = "k"
const val Consonants_f = "f"
const val Consonants_θ = "θ"
const val Consonants_s = "s"
const val Consonants_ʃ = "ʃ"
const val Consonants_h = "h"
const val Consonants_tʃ = "tʃ"
const val Consonants_tr = "tr"
const val Consonants_ts = "ts"

//浊辅音：b, d, g, v, ð (this), z, ʒ (pleasure), dʒ (joy), dr, dz
const val Consonants_b = "b"
const val Consonants_d = "d"
const val Consonants_g = "g"
const val Consonants_v = "v"
const val Consonants_ð = "ð"
const val Consonants_z = "z"
const val Consonants_ʒ = "ʒ"
const val Consonants_dʒ = "dʒ"
const val Consonants_dr = "dr"
const val Consonants_dz = "dz"

//鼻音、舌边音、半元音：m, n, ŋ (sing), l, r, j (yes), w (we)
const val Consonants_m = "m"
const val Consonants_n = "n"
const val Consonants_ŋ = "ŋ"
const val Consonants_l = "r"
const val Consonants_j = "j"
const val Consonants_w = "w"
//endregion

//region
//特殊发音/重音辅助符号（核心）
//在拼接完整单词音标时，这些符号必不可少：
//主重音符号（右上撇）：ˈ （注意：不是单引号 '，这个符号在 Unicode 中是重音专用符 \u02C8）
//次重音符号（左下撇）：ˌ
//长音符号（冒号状）：ː
//美式卷舌音标志：˞ (如 ɚ 或 ɝ)
//音标左右常加的括号：斜杠 / / 或 方括号 [ ]
//endregion


data class DataPhonetic(
    val symbol: String,//音标符号
    val symbol_us_uk: String? = null,//美英符合
    val pronunciationRules: String = "",//发音规则
)
