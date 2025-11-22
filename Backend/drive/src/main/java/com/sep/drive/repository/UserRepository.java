package com.sep.drive.repository;

import com.sep.drive.userprofile.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Custom finder methods (Spring will auto-implement them)
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
