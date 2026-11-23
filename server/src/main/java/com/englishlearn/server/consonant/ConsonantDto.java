package com.englishlearn.server.consonant;

import java.util.List;

/** 辅音对外结构：直接对应前端卡片的渲染字段。 */
public record ConsonantDto(
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

    public static ConsonantDto from(Consonant consonant) {
        return new ConsonantDto(
                consonant.getSymbol(),
                consonant.getKind(),
                consonant.getLabel(),
                consonant.getAudioFile(),
                consonant.getWord(),
                consonant.getWordIpa(),
                consonant.getTip(),
                consonant.getExamples().stream()
                        .map(example -> new WordDto(example.getWord(), example.getIpa()))
                        .toList());
    }
}
