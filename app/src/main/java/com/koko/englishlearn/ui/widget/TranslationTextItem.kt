package com.koko.englishlearn.ui.widget

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.koko.englishlearn.data.TranslationItem


@Composable
fun TranslationTextItem(item: TranslationItem) {
    Column(modifier = Modifier.padding(8.dp)) {
        // 永远显示原文
        Text(text = item.originalText, style = MaterialTheme.typography.bodyLarge)

        // 根据开关状态，动态决定是否显示译文
        if (item.isBilingual) {
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = item.translatedText, color = Color.Gray, style = MaterialTheme.typography.bodyMedium)
        }
    }
}