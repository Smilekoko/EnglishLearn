package com.englishlearn.server.grammar;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrammarSectionRepository extends JpaRepository<GrammarSection, String> {

    List<GrammarSection> findAllByOrderBySortOrderAsc();

    List<GrammarSection> findAllByTopicOrderBySortOrderAsc(String topic);

    long countByTopic(String topic);
}
