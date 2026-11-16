package com.englishlearn.server.grammar;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrammarCategoryRepository extends JpaRepository<GrammarCategoryEntity, String> {

    List<GrammarCategoryEntity> findAllByOrderBySortOrderAsc();
}
