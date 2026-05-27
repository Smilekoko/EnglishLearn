package com.koko.englishlearn.act

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Chip
import androidx.wear.compose.material.ChipDefaults
import com.koko.englishlearn.data.DataPhonetic
import com.koko.englishlearn.data.cvowels_ə
import com.koko.englishlearn.data.vowels_e
import com.koko.englishlearn.data.vowels_uk_ɒ
import com.koko.englishlearn.data.vowels_us_ɑ
import com.koko.englishlearn.data.vowels_æ
import com.koko.englishlearn.data.vowels_ɪ
import com.koko.englishlearn.data.vowels_ʊ
import com.koko.englishlearn.data.vowels_ʌ
import com.koko.englishlearn.ui.theme.EnglishLearnTheme
import kotlin.collections.listOf

class PhoneticActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EnglishLearnTheme {
                val items = remember {
                    listOf(
                        DataPhonetic(vowels_ɪ),
                        DataPhonetic(vowels_e),
                        DataPhonetic(vowels_æ),
                        DataPhonetic(vowels_uk_ɒ, "$vowels_uk_ɒ/$vowels_us_ɑ"),
                        DataPhonetic(vowels_ʌ),
                        DataPhonetic(vowels_ʊ),
                        DataPhonetic(cvowels_ə),
                    )
                }

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {

                        Text(
                            text = "元音部分 (Vowels)",
                            modifier = Modifier.padding(start = 16.dp),
                            fontSize = 16.sp,
                            fontFamily = FontFamily.SansSerif
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "单元音(短元音) 7个",
                            modifier = Modifier.padding(start = 16.dp),
                            fontSize = 14.sp,
                            fontFamily = FontFamily.SansSerif
                        )
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(5),          // 每行2列，可根据需求改为3、4等
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(horizontal = 16.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(items) { item ->
                                Chip(
                                    onClick = {},
                                    colors = ChipDefaults.chipColors(),
                                    border = ChipDefaults.chipBorder(),
                                    modifier = Modifier.fillMaxWidth(),   // 每个Chip撑满列宽，实现等宽
                                    content = {
                                        Box(modifier = Modifier.fillMaxSize()) {
                                            Text(
                                                item.symbol_us_uk ?: item.symbol,
                                                fontSize = 16.sp,
                                                modifier = Modifier
                                                    .align(Alignment.Center),
                                                textAlign = TextAlign.Center,
                                            )
                                        }

                                    }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

