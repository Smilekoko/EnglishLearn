package com.koko.englishlearn.data

//region 元音部分 (Vowels)
//单元音(短元音) 7个
const val vowels_ɪ = "ɪ"//sit /sɪt/ 嘴唇扁平、肌肉放松、短促地发出介于‘一’和‘呃’之间的声音。
const val vowels_e = "e"//bed /bed/ 张开一指宽，嘴角微微咧，干脆利落地发一个‘哎’（去尾音）。
const val vowels_æ = "æ"//cat
const val vowels_uk_ɒ = "ɒ"//hot,读起来像 "霍特"（偏“奥”的音）
const val vowels_us_ɑ = "ɑ"//hot,读起来像 "哈特"（偏“啊”的音）
const val vowels_ʌ = "ʌ"//run
const val vowels_ʊ = "ʊ"//put
const val cvowels_ə = "ə"//away

//单元音(长元音) 5个
const val vowels_iː = "iː"//see
const val vowels_ɑː = "ɑː"//father
const val vowels_ɔː = "ɔː"//water /ˈwɔːtər/
const val vowels_uː = "uː"//too
const val vowels_uk_ɜː = "ɜː"//bird /bɜːd/
const val vowels_us_ɝ = "ɝ"//bird /bɝd/ 卷舌（儿化）

//双元音 8个
const val vowels_eɪ = "eɪ" //say
const val vowels_aɪ = "aɪ"//my
const val vowels_ɔɪ = "aɪ"//boy
const val vowels_uk_əʊ = "əʊ"//go 由扁变圆
const val vowels_us_oʊ = "oʊ"//go 自始至终都是圆的
const val vowels_aʊ = "aʊ" //now
const val vowels_uk_ɪə = "ɪə" // near 完全不卷舌。从短促的“一”流畅地滑向放松的“额”。听起来就像中文里的 “一-额” 连读。
const val vowels_us_ɪr = "ɪr" // near 浓浓的儿化音。刚发出“一”的音，舌头立刻向后缩、舌尖向上卷，带出强大的 “儿” 音。
const val vowels_uk_eə = "eə"//hair 完全不卷舌。从“哎”流畅地滑向放松的短音“额”,听起来就像中文里叹气的 “哎-额” 连读。
const val vowels_us_ɛr = "ɛr"//hair 带有浓重的儿化音。刚发出“哎”的音，舌头立刻向后缩、舌尖向上翘起，顺滑地变成 “儿”。听起来就像 “哎-儿”
const val vowels_uk_ʊə = "ʊə"//poor 完全不卷舌。从短促放松的“乌”顺滑地滑向“额”。听起来就像中文里的 “乌-额” 连读。
const val vowels_us_ʊr = "ʊr"//poor 带有美式卷舌音。发出“乌”的音之后，舌头立刻向后缩、舌尖向上翘，顺滑地变成 “儿”。听起来就像 “乌-儿”。

//endregion


//region
//辅音部分 (Consonants)
//endregion

//region
//特殊发音/重音辅助符号（核心）
//endregion


data class DataPhonetic(
    val symbol: String,//音标符号
    val symbol_us_uk: String? = null,//美英符合
    val pronunciationRules: String = "",//发音规则
)
