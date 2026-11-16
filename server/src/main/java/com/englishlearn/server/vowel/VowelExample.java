package com.englishlearn.server.vowel;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/** 元音的补充例词。 */
@Entity
@Table(name = "vowel_examples")
public class VowelExample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vowel_id")
    private Vowel vowel;

    @Column(nullable = false, length = 32)
    private String word;

    @Column(length = 32)
    private String ipa;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected VowelExample() {
        // JPA
    }

    public VowelExample(String word, String ipa) {
        this.word = word;
        this.ipa = ipa;
    }

    void attachTo(Vowel vowel, int sortOrder) {
        this.vowel = vowel;
        this.sortOrder = sortOrder;
    }

    public String getWord() {
        return word;
    }

    public String getIpa() {
        return ipa;
    }
}
