package com.englishlearn.server.vocabulary;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/vocabulary")
public class VocabularyController {

    private final VocabSeriesRepository repository;

    public VocabularyController(VocabSeriesRepository repository) {
        this.repository = repository;
    }

    /** 所有词库系列（不含词条明细） */
    @GetMapping("/series")
    public List<VocabularyDto.SeriesSummary> series() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(VocabularyDto::summary)
                .toList();
    }

    /** 某个系列的词条，按分类分组 */
    @GetMapping("/series/{id}")
    public VocabularyDto.SeriesDetail detail(@PathVariable String id) {
        return repository.findById(id)
                .map(VocabularyDto::detail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "词库系列不存在: " + id));
    }
}
