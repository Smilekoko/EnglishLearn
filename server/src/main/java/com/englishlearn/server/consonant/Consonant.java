package com.englishlearn.server.consonant;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "consonants")
public class Consonant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8)
    private String symbol;

    /** plosive / fricative / affricate / nasal / lateral / approximant */
    @Column(length = 16)
    private String kind;

    /** 中文分组名：爆破音、摩擦音、破擦音、鼻音、边音、半元音 */
    @Column(length = 16)
    private String label;

    /** 主例词 */
    @Column(nullable = false, length = 32)
    private String word;

    @Column(name = "word_ipa", length = 32)
    private String wordIpa;

    /** 音频文件名；暂时没有音频，留空则前端不显示播放按钮 */
    @Column(name = "audio_file", length = 64)
    private String audioFile;

    /** 发音要点 */
    @Column(length = 200)
    private String tip;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @OneToMany(mappedBy = "consonant", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sortOrder ASC")
    private List<ConsonantExample> examples = new ArrayList<>();

    protected Consonant() {
        // JPA
    }

    public Consonant(String symbol) {
        this.symbol = symbol;
    }

    /** 种子数据按符号增量更新，已有辅音也能补上新字段 */
    public void update(String kind, String label, String word, String wordIpa, String audioFile, String tip, int sortOrder) {
        this.kind = kind;
        this.label = label;
        this.word = word;
        this.wordIpa = wordIpa;
        this.audioFile = audioFile;
        this.tip = tip;
        this.sortOrder = sortOrder;
    }

    public void replaceExamples(List<ConsonantExample> next) {
        this.examples.clear();
        int order = 1;
        for (ConsonantExample example : next) {
            example.attachTo(this, order++);
            this.examples.add(example);
        }
    }

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
    }

    public String getKind() {
        return kind;
    }

    public String getLabel() {
        return label;
    }

    public String getWord() {
        return word;
    }

    public String getWordIpa() {
        return wordIpa;
    }

    public String getAudioFile() {
        return audioFile;
    }

    public String getTip() {
        return tip;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public List<ConsonantExample> getExamples() {
        return examples;
    }
}
