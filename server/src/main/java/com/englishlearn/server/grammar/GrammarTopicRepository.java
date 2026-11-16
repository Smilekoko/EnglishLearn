package com.englishlearn.server.grammar;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrammarTopicRepository extends JpaRepository<GrammarTopicEntity, String> {

    List<GrammarTopicEntity> findAllByOrderBySortOrderAsc();
}
