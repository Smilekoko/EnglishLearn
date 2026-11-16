package com.englishlearn.server.vocabulary;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/** 词库里的一个词条，归属某个系列，并按分类（星期、月份、单位…）分组。 */
@Entity
@Table(name = "vocab_words")
public class VocabWord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "series_id", nullable = false)
    private VocabSeries series;

    @Column(nullable = false, length = 32)
    private String category;

    @Column(nullable = false, length = 64)
    private String en;

    @Column(nullable = false, length = 64)
    private String zh;

    @Column(length = 200)
    private String note;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected VocabWord() {
        // JPA
    }

    public VocabWord(String category, String en, String zh, String note, int sortOrder) {
        this.category = category;
        this.en = en;
        this.zh = zh;
        this.note = note;
        this.sortOrder = sortOrder;
    }

    void setSeries(VocabSeries series) {
        this.series = series;
    }

    public String getCategory() {
        return category;
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
