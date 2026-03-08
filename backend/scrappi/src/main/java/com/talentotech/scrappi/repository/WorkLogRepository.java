package com.talentotech.scrappi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talentotech.scrappi.model.WorkLog;

public interface WorkLogRepository extends JpaRepository<WorkLog, Long> {

    List<WorkLog> findByUserId(Long userId);

    List<WorkLog> findByWorkStationId(Long workStationId);

    Optional<WorkLog> findFirstByUserIdAndCompleteOrderByCreatedAtDesc(Long userId, Boolean complete);
}