package com.englishlearn.server.consonant;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/consonants")
public class ConsonantController {

    private final ConsonantRepository repository;

    public ConsonantController(ConsonantRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<ConsonantDto> all() {
        return repository.findAllByOrderBySortOrderAsc().stream()
                .map(ConsonantDto::from)
                .toList();
    }
}
