package com.englishlearn.server.grammar;

import java.util.List;

/** 对外的 JSON 结构，和实体解耦，避免关联循环和懒加载问题。 */
public record GrammarDto(
        String id,
        String topic,
        String title,
        String en,
        String level,
        String summary,
        List<String> points,
        List<ExampleDto> examples) {

    public record ExampleDto(String en, String zh, String note) {
    }

    public static GrammarDto from(GrammarSection section) {
        List<ExampleDto> examples = section.getExamples().stream()
                .map(e -> new ExampleDto(e.getEn(), e.getZh(), e.getNote()))
                .toList();
        return new GrammarDto(
                section.getId(),
                section.getTopic(),
                section.getTitle(),
                section.getEn(),
                section.getLevel(),
                section.getSummary(),
                section.getPoints(),
                examples);
    }
}
