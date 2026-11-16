package com.englishlearn.server.grammar;

import java.util.List;

/** 语法目录：大类 + 主题 + 每个主题已收录的节数。 */
public record GrammarCatalogDto(
        String key,
        String title,
        String en,
        String description,
        List<TopicDto> topics) {

    public record TopicDto(
            String key,
            String title,
            String en,
            String cardText,
            String lead,
            int sectionCount) {
    }
}
