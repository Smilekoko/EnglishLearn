package com.englishlearn.server.vocabulary;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/** 词库系列关联的语法主题，用来说明「这些词主要用在哪」。 */
@Embeddable
public class VocabRelatedTopic {

    /** 语法主题 key，对应 grammar_topics.id，如 tenses / passive */
    @Column(name = "topic_key", nullable = false, length = 64)
    private String topic;

    /** 所属大类：word / syntax，用于拼前端路由 */
    @Column(name = "category", nullable = false, length = 32)
    private String category;

    @Column(name = "title", nullable = false, length = 64)
    private String title;

    /** 一句话说明关联点 */
    @Column(name = "reason", length = 300)
    private String reason;

    protected VocabRelatedTopic() {
        // JPA
    }

    public VocabRelatedTopic(String topic, String category, String title, String reason) {
        this.topic = topic;
        this.category = category;
        this.title = title;
        this.reason = reason;
    }

    public String getTopic() {
        return topic;
    }

    public String getCategory() {
        return category;
    }

    public String getTitle() {
        return title;
    }

    public String getReason() {
        return reason;
    }
}
