package com.englishlearn.server.vowel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "vowels")
public class Vowel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8)
    private String symbol;

    @Column(nullable = false, length = 16)
    private String label;

    @Column(nullable = false, length = 32)
    private String word;

    @Column(name = "word_ipa", length = 32)
    private String wordIpa;

    @Column(name = "audio_file", length = 64)
    private String audioFile;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected Vowel() {
        // JPA
    }

    public Vowel(String symbol, String label, String word, String wordIpa, String audioFile, int sortOrder) {
        this.symbol = symbol;
        this.label = label;
        this.word = word;
        this.wordIpa = wordIpa;
        this.audioFile = audioFile;
        this.sortOrder = sortOrder;
    }

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return symbol;
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

    public int getSortOrder() {
        return sortOrder;
    }
}
