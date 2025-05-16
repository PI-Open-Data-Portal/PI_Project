package opendata.portal.api.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import opendata.portal.api.dto.ErrorReportDTO;
import opendata.portal.api.service.ErrorReportService;

@RestController
@RequestMapping("/apiV1/errorReports")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Error Reports", description = "API for managing error reports on case studies")
public class ErrorReportController {

    @Autowired
    private ErrorReportService errorReportService;
    
    private static final Logger log = LoggerFactory.getLogger(ErrorReportController.class);
    
    @Operation(summary = "Create a new error report")
    @PostMapping
    public ResponseEntity<ErrorReportDTO> createErrorReport(@Valid @RequestBody ErrorReportDTO reportDTO) {
        log.info("API request to create error report");
        ErrorReportDTO savedReport = errorReportService.createErrorReport(reportDTO);
        return new ResponseEntity<>(savedReport, HttpStatus.CREATED);
    }
    
    @Operation(summary = "Get all error reports with optional filtering")
    @GetMapping
    public ResponseEntity<List<ErrorReportDTO>> getErrorReports(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer itemId,
            @RequestParam(required = false) String errorType) {
        
        log.info("API request to get error reports with filters - status: {}, itemId: {}, errorType: {}", 
                status, itemId, errorType);
        
        List<ErrorReportDTO> reports = errorReportService.getErrorReports(status, itemId, errorType);
        return ResponseEntity.ok(reports);
    }
    
    @Operation(summary = "Get an error report by ID")
    @GetMapping("/{id}")
    public ResponseEntity<ErrorReportDTO> getErrorReportById(@PathVariable Long id) {
        log.info("API request to get error report with ID: {}", id);
        
        ErrorReportDTO report = errorReportService.getErrorReportById(id);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report);
    }
    
    @Operation(summary = "Update the status of an error report")
    @PatchMapping("/{id}")
    public ResponseEntity<ErrorReportDTO> updateErrorReportStatus(
            @PathVariable Long id, 
            @RequestBody StatusUpdateRequest statusRequest) {
        
        log.info("API request to update status of error report ID: {} to: {}", id, statusRequest.getStatus());
        
        try {
            ErrorReportDTO updatedReport = errorReportService.updateErrorReportStatus(id, statusRequest.getStatus());
            if (updatedReport == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedReport);
        } catch (IllegalArgumentException e) {
            log.warn("Bad request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Helper class for status update requests
     */
    private static class StatusUpdateRequest {
        private String status;
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
}