package com.englishlearn.server.vocabulary;

import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.OrderColumn;
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

    /** 关联的语法主题，用于详情页的「相关语法」跳转；可以为空 */
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "vocab_series_related", joinColumns = @JoinColumn(name = "series_id"))
    @OrderColumn(name = "pos")
    private List<VocabRelatedTopic> related = new ArrayList<>();

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

    /** 整组替换关联主题（种子数据重启时刷新） */
    public void replaceRelated(List<VocabRelatedTopic> next) {
        this.related.clear();
        this.related.addAll(next);
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

    public List<VocabRelatedTopic> getRelated() {
        return related;
    }
}
