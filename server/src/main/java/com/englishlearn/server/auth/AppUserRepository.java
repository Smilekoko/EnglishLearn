package com.englishlearn.server.auth;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Page<AppUser> findByNicknameContainingIgnoreCase(String nickname, Pageable pageable);

    Page<AppUser> findByStatus(String status, Pageable pageable);

    List<AppUser> findTop20ByOrderByCreatedAtDesc();

    Optional<AppUser> findById(Long id);
}
