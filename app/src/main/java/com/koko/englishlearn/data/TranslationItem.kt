package com.koko.englishlearn.data

/**
 * 双语数据模型
 */
data class TranslationItem(
    val originalText: String,   // 原文
    val translatedText: String, // 译文
    var isBilingual: Boolean = true // 是否显示双语（可动态开启/关闭）
)