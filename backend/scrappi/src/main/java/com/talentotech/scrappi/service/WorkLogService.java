package com.talentotech.scrappi.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.talentotech.scrappi.exception.ResourceNotFoundException;
import com.talentotech.scrappi.model.User;
import com.talentotech.scrappi.model.WorkLog;
import com.talentotech.scrappi.model.WorkStation;
import com.talentotech.scrappi.repository.UserRepository;
import com.talentotech.scrappi.repository.WorkLogRepository;
import com.talentotech.scrappi.repository.WorkStationRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class WorkLogService {

    private final WorkLogRepository workLogRepository;
    private final UserRepository userRepository;
    private final WorkStationRepository workStationRepository;

    public WorkLog create(WorkLog workLog) {
        Long userId = workLog.getUser().getId();
        Long workStationId = workLog.getWorkStation().getId();

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        WorkStation workStation = workStationRepository.findById(workStationId)
                .orElseThrow(() -> new ResourceNotFoundException("WorkStation not found"));

        workLog.setUser(user);
        workLog.setWorkStation(workStation);

        if (workLog.getHourCheckIn() == null) {
            workLog.setHourCheckIn(LocalDateTime.now());
        }

        workLog.setComplete(false);

        return workLogRepository.save(workLog);
    }

    public WorkLog checkout(Long id, Double longitudeOut, Double latitudeOut) {
        WorkLog workLog = workLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkLog not found"));

        workLog.setHourCheckOut(LocalDateTime.now());
        workLog.setLongitudeOut(longitudeOut);
        workLog.setLatitudeOut(latitudeOut);
        workLog.setComplete(true);

        return workLogRepository.save(workLog);
    }

    public List<WorkLog> findAll() {
        return workLogRepository.findAll();
    }

    public WorkLog findById(Long id) {
        return workLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkLog not found"));
    }

    public List<WorkLog> findByUser(Long userId) {
        return workLogRepository.findByUserId(userId);
    }

    public List<WorkLog> findByWorkStation(Long workStationId) {
        return workLogRepository.findByWorkStationId(workStationId);
    }
}