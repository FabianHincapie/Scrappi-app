package com.talentotech.scrappi.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.talentotech.scrappi.dto.WorkLogCheckoutRequest;
import com.talentotech.scrappi.model.WorkLog;
import com.talentotech.scrappi.service.WorkLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/worklogs")
@RequiredArgsConstructor
public class WorkLogController {

    private final WorkLogService workLogService;

    @PostMapping
    public ResponseEntity<WorkLog> create(@RequestBody WorkLog workLog) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workLogService.create(workLog));
    }

    @PutMapping("/{id}/checkout")
    public ResponseEntity<WorkLog> checkout(@PathVariable Long id,
                                            @RequestBody WorkLogCheckoutRequest request) {
        return ResponseEntity.ok(
                workLogService.checkout(id, request.getLongitudeOut(), request.getLatitudeOut())
        );
    }

    @GetMapping
    public ResponseEntity<List<WorkLog>> findAll() {
        return ResponseEntity.ok(workLogService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkLog> findById(@PathVariable Long id) {
        return ResponseEntity.ok(workLogService.findById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkLog>> findByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(workLogService.findByUser(userId));
    }

    @GetMapping("/workstation/{workStationId}")
    public ResponseEntity<List<WorkLog>> findByWorkStation(@PathVariable Long workStationId) {
        return ResponseEntity.ok(workLogService.findByWorkStation(workStationId));
    }
}