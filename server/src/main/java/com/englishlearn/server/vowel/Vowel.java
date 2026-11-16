package com.englishlearn.server.vowel;

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
@Table(name = "vowels")
public class Vowel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8)
    private String symbol;

    /** monophthong（单元音）/ diphthong（双元音） */
    @Column(length = 16)
    private String kind;

    @Column(nullable = false, length = 16)
    private String label;

    /** 主例词 */
    @Column(nullable = false, length = 32)
    private String word;

    @Column(name = "word_ipa", length = 32)
    private String wordIpa;

    @Column(name = "audio_file", length = 64)
    private String audioFile;

    /** 发音要点 */
    @Column(length = 200)
    private String tip;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @OneToMany(mappedBy = "vowel", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("sortOrder ASC")
    private List<VowelExample> examples = new ArrayList<>();

    protected Vowel() {
        // JPA
    }

    public Vowel(String symbol) {
        this.symbol = symbol;
    }

    /** 种子数据按符号增量更新，已有元音也能补上新字段 */
    public void update(String kind, String label, String word, String wordIpa, String tip, String audioFile, int sortOrder) {
        this.kind = kind;
        this.label = label;
        this.word = word;
        this.wordIpa = wordIpa;
        this.tip = tip;
        this.audioFile = audioFile;
        this.sortOrder = sortOrder;
    }

    public void replaceExamples(List<VowelExample> next) {
        this.examples.clear();
        int order = 1;
        for (VowelExample example : next) {
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

    public List<VowelExample> getExamples() {
        return examples;
    }
}
