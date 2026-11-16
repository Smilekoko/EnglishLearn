package com.englishlearn.server.vocabulary;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

/** 词库系列，如「日期数字单位」。一个系列下按分类存放多个词条。 */
@Entity
@Table(name = "vocab_series")
public class VocabSeries {

    @Id
    @Column(length = 64)
    private String id;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(nullable = false, length = 128)
    private String en;

    @Column(length = 500)
    private String summary;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sortOrder ASC")
    private List<VocabWord> words = new ArrayList<>();

    protected VocabSeries() {
        // JPA
    }

    public VocabSeries(String id, String title, String en, String summary, int sortOrder) {
        this.id = id;
        this.title = title;
        this.en = en;
        this.summary = summary;
        this.sortOrder = sortOrder;
    }

    public void addWord(VocabWord word) {
        word.setSeries(this);
        this.words.add(word);
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

    public String getSummary() {
        return summary;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public List<VocabWord> getWords() {
        return words;
    }
}
