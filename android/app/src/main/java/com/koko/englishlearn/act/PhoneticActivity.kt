package com.koko.englishlearn.act

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.LocalOverscrollConfiguration
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.wear.compose.material.Chip
import androidx.wear.compose.material.ChipDefaults
import com.koko.englishlearn.data.Consonants_b
import com.koko.englishlearn.data.Consonants_d
import com.koko.englishlearn.data.Consonants_dr
import com.koko.englishlearn.data.Consonants_dz
import com.koko.englishlearn.data.Consonants_dʒ
import com.koko.englishlearn.data.Consonants_f
import com.koko.englishlearn.data.Consonants_g
import com.koko.englishlearn.data.Consonants_h
import com.koko.englishlearn.data.Consonants_k
import com.koko.englishlearn.data.Consonants_p
import com.koko.englishlearn.data.Consonants_s
import com.koko.englishlearn.data.Consonants_t
import com.koko.englishlearn.data.Consonants_tr
import com.koko.englishlearn.data.Consonants_ts
import com.koko.englishlearn.data.Consonants_tʃ
import com.koko.englishlearn.data.Consonants_v
import com.koko.englishlearn.data.Consonants_z
import com.koko.englishlearn.data.Consonants_ð
import com.koko.englishlearn.data.Consonants_ʃ
import com.koko.englishlearn.data.Consonants_ʒ
import com.koko.englishlearn.data.Consonants_θ
import com.koko.englishlearn.data.Vowels_aɪ
import com.koko.englishlearn.data.Vowels_aʊ
import com.koko.englishlearn.data.Vowels_e
import com.koko.englishlearn.data.Vowels_eɪ
import com.koko.englishlearn.data.Vowels_iː
import com.koko.englishlearn.data.Vowels_uk_eə
import com.koko.englishlearn.data.Vowels_uk_ɒ
import com.koko.englishlearn.data.Vowels_uk_əʊ
import com.koko.englishlearn.data.Vowels_uk_ɜː
import com.koko.englishlearn.data.Vowels_uk_ɪə
import com.koko.englishlearn.data.Vowels_uk_ʊə
import com.koko.englishlearn.data.Vowels_us_oʊ
import com.koko.englishlearn.data.Vowels_us_ɑ
import com.koko.englishlearn.data.Vowels_us_ɛr
import com.koko.englishlearn.data.Vowels_us_ɝ
import com.koko.englishlearn.data.Vowels_us_ɪr
import com.koko.englishlearn.data.Vowels_us_ʊr
import com.koko.englishlearn.data.Vowels_uː
import com.koko.englishlearn.data.Vowels_æ
import com.koko.englishlearn.data.Vowels_ɑː
import com.koko.englishlearn.data.Vowels_ɔɪ
import com.koko.englishlearn.data.Vowels_ɔː
import com.koko.englishlearn.data.Vowels_ə
import com.koko.englishlearn.data.Vowels_ɪ
import com.koko.englishlearn.data.Vowels_ʊ
import com.koko.englishlearn.data.Vowels_ʌ
import com.koko.englishlearn.data.DataPhonetic
import com.koko.englishlearn.ui.theme.EnglishLearnTheme
import androidx.compose.ui.graphics.graphicsLayer


class PhoneticActivity : ComponentActivity() {
    @OptIn(ExperimentalFoundationApi::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            EnglishLearnTheme {
                //单元音(短元音) 7个
                val items = remember {
                    listOf(
                        DataPhonetic(Vowels_ɪ),
                        DataPhonetic(Vowels_e),
                        DataPhonetic(Vowels_æ),
                        DataPhonetic(Vowels_uk_ɒ, "$Vowels_uk_ɒ/$Vowels_us_ɑ"),
                        DataPhonetic(Vowels_ʌ),
                        DataPhonetic(Vowels_ʊ),
                        DataPhonetic(Vowels_ə),
                    )
                }
                //单元音(长元音) 5个
                val items2 = remember {
                    listOf(
                        DataPhonetic(Vowels_iː),
                        DataPhonetic(Vowels_ɑː),
                        DataPhonetic(Vowels_ɔː),
                        DataPhonetic(Vowels_uː),
                        DataPhonetic(Vowels_uk_ɜː, "$Vowels_uk_ɜː/$Vowels_us_ɝ"),
                    )
                }
                //双元音 8个
                val items3 = remember {
                    listOf(
                        DataPhonetic(Vowels_eɪ),
                        DataPhonetic(Vowels_aɪ),
                        DataPhonetic(Vowels_ɔɪ),
                        DataPhonetic(Vowels_uk_əʊ, "$Vowels_uk_əʊ/$Vowels_us_oʊ"),
                        DataPhonetic(Vowels_aʊ),
                        DataPhonetic(Vowels_uk_ɪə, "$Vowels_uk_ɪə/$Vowels_us_ɪr"),
                        DataPhonetic(Vowels_uk_eə, "$Vowels_uk_eə/$Vowels_us_ɛr"),
                        DataPhonetic(Vowels_uk_ʊə, "$Vowels_uk_ʊə/$Vowels_us_ʊr"),
                    )
                }
                //清辅音 11个
                val items4 = remember {
                    listOf(
                        DataPhonetic(Consonants_p),
                        DataPhonetic(Consonants_t),
                        DataPhonetic(Consonants_k),
                        DataPhonetic(Consonants_f),
                        DataPhonetic(Consonants_θ),
                        DataPhonetic(Consonants_s),
                        DataPhonetic(Consonants_ʃ),
                        DataPhonetic(Consonants_h),
                        DataPhonetic(Consonants_tʃ),
                        DataPhonetic(Consonants_tr),
                        DataPhonetic(Consonants_ts),
                    )
                }
                //浊辅音 10个
                val items5 = remember {
                    listOf(
                        DataPhonetic(Consonants_b),
                        DataPhonetic(Consonants_d),
                        DataPhonetic(Consonants_g),
                        DataPhonetic(Consonants_v),
                        DataPhonetic(Consonants_ð),
                        DataPhonetic(Consonants_z),
                        DataPhonetic(Consonants_ʒ),
                        DataPhonetic(Consonants_dʒ),
                        DataPhonetic(Consonants_dr),
                        DataPhonetic(Consonants_dz),
                    )
                }

                Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
                    // 定义网格的最大列数（你原本短元音是5列，双元音是4列，这里统一设为 5 列，或者根据视觉调整）
                    val maxSpan = 4

                    CompositionLocalProvider(
                        @OptIn(ExperimentalFoundationApi::class)
                        LocalOverscrollConfiguration provides null
                    ) {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(maxSpan),
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding),
                            contentPadding = PaddingValues(16.dp),
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            verticalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            // ==========================================
                            // 元音部分 (Vowels)
                            // ==========================================
                            item(span = { GridItemSpan(maxSpan) }) {
                                Text(
                                    text = "元音部分 (Vowels)",
                                    fontSize = 24.sp,
                                    fontFamily = FontFamily.SansSerif,
                                    modifier = Modifier.padding(bottom = 12.dp)
                                )
                            }

                            // 单元音(短元音)
                            item(span = { GridItemSpan(maxSpan) }) {
                                Text(
                                    text = "单元音(短元音) ${items.size}个",
                                    fontSize = 14.sp,
                                    fontFamily = FontFamily.SansSerif,
                                    modifier = Modifier.padding(start = 4.dp, bottom = 4.dp)
                                )
                            }
                            items(items) { item ->
                                PhoneticChip(item)
                            }

                            // 单元音(长元音)
                            item(span = { GridItemSpan(maxSpan) }) {
                                Text(
                                    text = "单元音(长元音) ${items2.size}个",
                                    fontSize = 14.sp,
                                    fontFamily = FontFamily.SansSerif,
                                    modifier = Modifier.padding(start = 4.dp, top = 16.dp, bottom = 4.dp)
                                )
                            }
                            items(items2) { item ->
                                PhoneticChip(item)
                            }

                            // 双元音
                            item(span = { GridItemSpan(maxSpan) }) {
                                Text(
                                    text = "双元音 ${items3.size}个",
                                    fontSize = 14.sp,
                                    fontFamily = FontFamily.SansSerif,
                                    modifier = Modifier.padding(start = 4.dp, top = 16.dp, bottom = 4.dp)
                                )
                            }
                            items(items3) { item ->
                                PhoneticChip(item)
                            }

                            // ==========================================
                            // 辅音部分 (Consonants)
                            // ==========================================
                            item(span = { GridItemSpan(maxSpan) }) {
                                Text(
                                    text = "辅音部分 (Consonants)",
                                    fontSize = 24.sp,
                                    fontFamily = FontFamily.SansSerif,
                                    modifier = Modifier.padding(top = 24.dp, bottom = 12.dp)
                                )
                            }

                            // 清辅音
                            item(span = { GridItemSpan(maxSpan) }) {
                                Text(
                                    text = "清辅音 ${items4.size}个", // 已修正：原代码误写为了 items3.size
                                    fontSize = 14.sp,
                                    fontFamily = FontFamily.SansSerif,
                                    modifier = Modifier.padding(start = 4.dp, bottom = 4.dp)
                                )
                            }
                            items(items4) { item ->
                                PhoneticChip(item)
                            }

                            // 浊辅音
                            item(span = { GridItemSpan(maxSpan) }) {
                                Text(
                                    text = "浊辅音 ${items5.size}个",
                                    fontSize = 14.sp,
                                    fontFamily = FontFamily.SansSerif,
                                    modifier = Modifier.padding(start = 4.dp, top = 16.dp, bottom = 4.dp)
                                )
                            }
                            items(items5) { item ->
                                PhoneticChip(item)
                            }
                        }
                    }

                }
            }
        }
    }
}


@Composable
fun PhoneticChip(item: DataPhonetic) {
    Chip(
        onClick = {},
        colors = ChipDefaults.chipColors(),
        border = ChipDefaults.chipBorder(),
        modifier = Modifier.fillMaxWidth(),
        content = {
            Box(modifier = Modifier.fillMaxSize()) {
                Text(
                    text = item.symbol_us_uk ?: item.symbol,
                    fontSize = 16.sp,
                    modifier = Modifier.align(Alignment.Center),
                    textAlign = TextAlign.Center,
                )
            }
        }
    )
}