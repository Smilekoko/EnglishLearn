package com.englishlearn.server.grammar;

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

@Entity
@Table(name = "grammar_sections")
public class GrammarSection {

    @Id
    @Column(length = 64)
    private String id;

    /** 所属主题：noun、articles…（对应前端 /grammar/word/{topic}） */
    @Column(nullable = false, length = 32)
    private String topic;

    @Column(nullable = false, length = 64)
    private String title;

    @Column(nullable = false, length = 128)
    private String en;

    @Column(nullable = false, length = 16)
    private String level;

    @Column(length = 1000)
    private String summary;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "grammar_points", joinColumns = @JoinColumn(name = "section_id"))
    @OrderColumn(name = "pos")
    @Column(name = "point", nullable = false, length = 512)
    private List<String> points = new ArrayList<>();

    @OneToMany(mappedBy = "section", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sortOrder ASC")
    private List<GrammarExample> examples = new ArrayList<>();

    protected GrammarSection() {
        // JPA
    }

    public GrammarSection(
            String id,
            String topic,
            String title,
            String en,
            String level,
            String summary,
            int sortOrder,
            List<String> points) {
        this.id = id;
        this.topic = topic;
        this.title = title;
        this.en = en;
        this.level = level;
        this.summary = summary;
        this.sortOrder = sortOrder;
        this.points = new ArrayList<>(points);
    }

    public void addExample(GrammarExample example) {
        example.setSection(this);
        this.examples.add(example);
    }

    public String getTopic() {
        return topic;
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

    public String getLevel() {
        return level;
    }

    public String getSummary() {
        return summary;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public List<String> getPoints() {
        return points;
    }

    public List<GrammarExample> getExamples() {
        return examples;
    }
}
