package com.englishlearn.server.grammar;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** 语法大类：词法 word / 句法 syntax。 */
@Entity
@Table(name = "grammar_categories")
public class GrammarCategoryEntity {

    @Id
    @Column(length = 32)
    private String id;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(nullable = false, length = 128)
    private String en;

    @Column(length = 500)
    private String description;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected GrammarCategoryEntity() {
        // JPA
    }

    public GrammarCategoryEntity(String id, String title, String en, String description, int sortOrder) {
        this.id = id;
        this.title = title;
        this.en = en;
        this.description = description;
        this.sortOrder = sortOrder;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getEn() {
        return en;
    }

    public String getDescription() {
        return description;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
