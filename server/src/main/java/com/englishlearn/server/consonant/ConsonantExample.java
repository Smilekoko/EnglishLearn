package com.englishlearn.server.consonant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

/** 辅音的补充例词。 */
@Entity
@Table(name = "consonant_examples")
public class ConsonantExample {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "consonant_id")
    private Consonant consonant;

    @Column(nullable = false, length = 32)
    private String word;

    @Column(length = 32)
    private String ipa;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    protected ConsonantExample() {
        // JPA
    }

    public ConsonantExample(String word, String ipa) {
        this.word = word;
        this.ipa = ipa;
    }

    void attachTo(Consonant consonant, int sortOrder) {
        this.consonant = consonant;
        this.sortOrder = sortOrder;
    }

    public String getWord() {
        return word;
    }

    public String getIpa() {
        return ipa;
    }
}
