package com.englishlearn.server.vocabulary;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** 词库对外的 JSON 结构。 */
public record VocabularyDto() {

    public record SeriesSummary(String id, String title, String en, String summary, int wordCount) {
    }

    public record WordItem(String en, String zh, String note) {
    }

    public record CategoryGroup(String category, List<WordItem> words) {
    }

    /** 关联的语法主题：前端据此渲染「相关语法」跳转 */
    public record RelatedItem(String topic, String category, String title, String reason) {
    }

    public record SeriesDetail(
            String id,
            String title,
            String en,
            String summary,
            int wordCount,
            List<CategoryGroup> categories,
            List<RelatedItem> related) {
    }

    public static SeriesSummary summary(VocabSeries series) {
        return new SeriesSummary(
                series.getId(),
                series.getTitle(),
                series.getEn(),
                series.getSummary(),
                series.getWords().size());
    }

    public static SeriesDetail detail(VocabSeries series) {
        Map<String, List<WordItem>> grouped = new LinkedHashMap<>();
        for (VocabWord word : series.getWords()) {
            grouped.computeIfAbsent(word.getCategory(), key -> new ArrayList<>())
                    .add(new WordItem(word.getEn(), word.getZh(), word.getNote()));
        }
        List<CategoryGroup> categories = grouped.entrySet().stream()
                .map(entry -> new CategoryGroup(entry.getKey(), entry.getValue()))
                .toList();
        List<RelatedItem> related = series.getRelated().stream()
                .map(item -> new RelatedItem(item.getTopic(), item.getCategory(), item.getTitle(), item.getReason()))
                .toList();
        return new SeriesDetail(
                series.getId(),
                series.getTitle(),
                series.getEn(),
                series.getSummary(),
                series.getWords().size(),
                categories,
                related);
    }
}
