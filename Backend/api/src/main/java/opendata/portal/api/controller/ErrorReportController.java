package opendata.portal.api.controller;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import opendata.portal.api.dto.ErrorReportDTO;
import opendata.portal.api.service.ErrorReportService;

@RestController
@RequestMapping("/apiV1/errorReports")
@Tag(name = "Error Reports", description = "API for managing error reports")
public class ErrorReportController {

    @Autowired
    private ErrorReportService errorReportService;

    private static final Logger log = LoggerFactory.getLogger(ErrorReportController.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Operation(summary = "Get all error reports with optional filtering")
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public ResponseEntity<List<ErrorReportDTO>> getErrorReports(
            @Parameter(description = "Filter by status (Resolved, Unresolved, In Progress)") 
            @RequestParam(required = false) String status,
            @Parameter(description = "Filter by item ID") 
            @RequestParam(required = false) Integer itemId,
            @Parameter(description = "Filter by error type") 
            @RequestParam(required = false) String errorType) {
        
        log.info("Getting error reports with filters - status: {}, itemId: {}, errorType: {}", 
                status, itemId, errorType);
        
        List<ErrorReportDTO> reports = errorReportService.getErrorReports(status, itemId, errorType);
        return ResponseEntity.ok(reports);
    }

    @Operation(summary = "Get error report by ID")
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/{id}")
    public ResponseEntity<ErrorReportDTO> getErrorReportById(@PathVariable Long id) {
        log.info("Getting error report with ID: {}", id);
        
        ErrorReportDTO report = errorReportService.getErrorReportById(id);
        if (report == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(report);
    }

    @Operation(summary = "Create a new error report")
    @CrossOrigin(origins = "http://localhost:3000")
    @PostMapping
    public ResponseEntity<ErrorReportDTO> createErrorReport(@Valid @RequestBody ErrorReportDTO reportDTO) {
        log.info("Creating new error report");
        
        ErrorReportDTO createdReport = errorReportService.createErrorReport(reportDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdReport);
    }

    @Operation(summary = "Update error report status")
    @CrossOrigin(origins = "http://localhost:3000")
    @PatchMapping("/{id}")
    public ResponseEntity<ErrorReportDTO> updateErrorStatus(
            @PathVariable Long id,
            @RequestBody UpdateStatusRequest request) {
        
        log.info("Updating status of error report ID: {} to: {}", id, request.getStatus());
        
        try {
            ErrorReportDTO updatedReport = errorReportService.updateErrorReportStatus(id, request.getStatus());
            if (updatedReport == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedReport);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    @Operation(summary = "Update error report severity")
    @CrossOrigin(origins = "http://localhost:3000")
    @PutMapping
    public ResponseEntity<ErrorReportDTO> updateErrorSeverity(@RequestBody UpdateSeverityRequest request) {
        log.info("Updating severity of error report ID: {} to: {}", request.getErrorId(), request.getSeverity());
        
        try {
            ErrorReportDTO updatedReport = errorReportService.updateErrorReportSeverity(
                    request.getErrorId(), request.getSeverity());
            
            if (updatedReport == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updatedReport);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    @Operation(summary = "Download error reports as CSV")
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping("/download")
    public ResponseEntity<byte[]> downloadErrorReports(
            @Parameter(description = "Filter by status") 
            @RequestParam(required = false) String status,
            @Parameter(description = "Filter by item ID") 
            @RequestParam(required = false) Integer itemId,
            @Parameter(description = "Filter by error type") 
            @RequestParam(required = false) String errorType) {
        
        log.info("Downloading error reports with filters - status: {}, itemId: {}, errorType: {}", 
                status, itemId, errorType);
        
        try {
            // Get filtered reports
            List<ErrorReportDTO> reports = errorReportService.getErrorReports(status, itemId, errorType);
            
            // Generate CSV content
            byte[] csvContent = generateCsvContent(reports);
            
            // Set response headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("text/csv"));
            headers.setContentDispositionFormData("attachment", "error-reports.csv");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
            
            return new ResponseEntity<>(csvContent, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("Error generating CSV file: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error generating CSV file");
        }
    }
    
    private byte[] generateCsvContent(List<ErrorReportDTO> reports) throws IOException {
        StringBuilder csvBuilder = new StringBuilder();
        
        // CSV Header
        csvBuilder.append("Error ID,Error Type,Description,Item IDs,Status,Severity,Created At,Updated At,Reported By\n");
        
        // CSV Data rows
        for (ErrorReportDTO report : reports) {
            csvBuilder.append(report.getId()).append(",");
            csvBuilder.append(escapeCsvField(report.getErrorType())).append(",");
            csvBuilder.append(escapeCsvField(report.getDescription())).append(",");
            
            // Format the list of item IDs
            String itemIds = report.getItemIds() != null ? 
                    report.getItemIds().toString().replace("[", "").replace("]", "") : "";
            csvBuilder.append(escapeCsvField(itemIds)).append(",");
            
            csvBuilder.append(escapeCsvField(report.getStatus())).append(",");
            csvBuilder.append(escapeCsvField(report.getSeverity())).append(",");
            
            // Format dates
            String createdAt = report.getCreatedAt() != null ? 
                    report.getCreatedAt().format(DATE_FORMATTER) : "";
            csvBuilder.append(escapeCsvField(createdAt)).append(",");
            
            String updatedAt = report.getUpdatedAt() != null ? 
                    report.getUpdatedAt().format(DATE_FORMATTER) : "";
            csvBuilder.append(escapeCsvField(updatedAt)).append(",");
            
            csvBuilder.append(escapeCsvField(report.getReporter() != null ? report.getReporter() : ""));
            csvBuilder.append("\n");
        }
        
        return csvBuilder.toString().getBytes("UTF-8");
    }
    
    private String escapeCsvField(String field) {
        if (field == null) {
            return "";
        }
        
        // If the field contains commas, quotes, or newlines, wrap it in quotes and escape any quotes
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }
        return field;
    }
    
    // Helper classes for request bodies
    public static class UpdateStatusRequest {
        private String status;
        
        public String getStatus() {
            return status;
        }
        
        public void setStatus(String status) {
            this.status = status;
        }
    }
    
    public static class UpdateSeverityRequest {
        private Long errorId;
        private String severity;
        
        public Long getErrorId() {
            return errorId;
        }
        
        public void setErrorId(Long errorId) {
            this.errorId = errorId;
        }
        
        public String getSeverity() {
            return severity;
        }
        
        public void setSeverity(String severity) {
            this.severity = severity;
        }
    }
}