package com.englishlearn.server.vowel;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VowelRepository extends JpaRepository<Vowel, Long> {

    List<Vowel> findAllByOrderBySortOrderAsc();

    Optional<Vowel> findBySymbol(String symbol);
}
