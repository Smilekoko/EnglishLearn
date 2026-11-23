package com.englishlearn.server.consonant;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsonantRepository extends JpaRepository<Consonant, Long> {

    List<Consonant> findAllByOrderBySortOrderAsc();

    Optional<Consonant> findBySymbol(String symbol);
}
