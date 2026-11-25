package com.englishlearn.server.auth;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserIdentityRepository extends JpaRepository<UserIdentity, Long> {

    Optional<UserIdentity> findByProviderAndSubject(String provider, String subject);

    Optional<UserIdentity> findByUserIdAndProvider(Long userId, String provider);

    List<UserIdentity> findByUserId(Long userId);

    List<UserIdentity> findByUserIdIn(Collection<Long> userIds);
}
