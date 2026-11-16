package com.englishlearn.server.grammar;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "grammar_examples")
public class GrammarExample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "section_id")
    @JsonIgnore
    private GrammarSection section;

    @Column(nullable = false, length = 512)
    private String en;

    @Column(nullable = false, length = 512)
    private String zh;

    @Column(length = 512)
    private String note;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected GrammarExample() {
        // JPA
    }

    public GrammarExample(String en, String zh, String note, int sortOrder) {
        this.en = en;
        this.zh = zh;
        this.note = note;
        this.sortOrder = sortOrder;
    }

    void setSection(GrammarSection section) {
        this.section = section;
    }

    public Long getId() {
        return id;
    }

    public String getEn() {
        return en;
    }

    public String getZh() {
        return zh;
    }

    public String getNote() {
        return note;
    }

    public int getSortOrder() {
        return sortOrder;
    }
}
