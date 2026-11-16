package com.englishlearn.server.grammar;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** 语法主题（目录项）：名词、定语从句等，对应 grammar_sections.topic。 */
@Entity
@Table(name = "grammar_topics")
public class GrammarTopicEntity {

    @Id
    @Column(length = 64)
    private String id;

    /** 所属大类：word / syntax */
    @Column(name = "category", nullable = false, length = 32)
    private String category;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(nullable = false, length = 128)
    private String en;

    /** 目录卡片上的一句话摘要 */
    @Column(name = "card_text", length = 500)
    private String cardText;

    /** 详情页导语 */
    @Column(length = 1000)
    private String lead;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected GrammarTopicEntity() {
        // JPA
    }

    public GrammarTopicEntity(
            String id, String category, String title, String en, String cardText, String lead, int sortOrder) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.en = en;
        this.cardText = cardText;
        this.lead = lead;
        this.sortOrder = sortOrder;
    }

    public String getId() {
        return id;
    }

    public String getCategory() {
        return category;
    }

    public String getTitle() {
        return title;
    }

    public String getEn() {
        return en;
    }

    public String getCardText() {
        return cardText;
    }

    public String getLead() {
        return lead;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
