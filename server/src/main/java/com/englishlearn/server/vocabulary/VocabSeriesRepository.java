package com.englishlearn.server.vocabulary;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VocabSeriesRepository extends JpaRepository<VocabSeries, String> {

    List<VocabSeries> findAllByOrderBySortOrderAsc();
}
