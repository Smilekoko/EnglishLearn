package com.englishlearn.server.vowel;

import java.util.List;

/** 元音对外结构：直接对应前端卡片的渲染字段。 */
public record VowelDto(
        String symbol,
        String kind,
        String label,
        String audio,
        String word,
        String wordIpa,
        String tip,
        List<WordDto> examples) {

    public record WordDto(String word, String ipa) {
    }

    public static VowelDto from(Vowel vowel) {
        return new VowelDto(
                vowel.getSymbol(),
                vowel.getKind(),
                vowel.getLabel(),
                vowel.getAudioFile(),
                vowel.getWord(),
                vowel.getWordIpa(),
                vowel.getTip(),
                vowel.getExamples().stream()
                        .map(example -> new WordDto(example.getWord(), example.getIpa()))
                        .toList());
    }
}
