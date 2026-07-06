package com.project.recruitment.repository;

import com.project.recruitment.model.CV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface CVRepository extends JpaRepository<CV, Long> {
    Optional<CV> findByUserId(Long userId);

}