package com.englishlearn.server.vowel;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vowels")
public class VowelController {

    private final VowelRepository repository;

    public VowelController(VowelRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Vowel> all() {
        return repository.findAllByOrderBySortOrderAsc();
    }
}
