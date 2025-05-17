package opendata.portal.api.service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import jakarta.persistence.criteria.Predicate;
import opendata.portal.api.dto.ErrorReportDTO;
import opendata.portal.api.model.ErrorReport;
import opendata.portal.api.repository.ErrorReportRepository;

@Service
public class ErrorReportService {

    @Autowired
    private ErrorReportRepository errorReportRepository;

    private static final Logger log = LoggerFactory.getLogger(ErrorReportService.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Create a new error report
     * 
     * @param reportDTO the error report information
     * @return saved error report
     */
    public ErrorReportDTO createErrorReport(ErrorReportDTO reportDTO) {
        log.info("Creating new error report");
        
        ErrorReport report = ErrorReport.builder()
                .itemIds(reportDTO.getItemIds())
                .errorType(reportDTO.getErrorType())
                .description(reportDTO.getDescription())
                .reporter(reportDTO.getReporter())
                .status("Unresolved") // Default status for new reports
                .severity("MEDIUM") // Default severity for new reports
                .createdAt(LocalDateTime.now())
                .build();
        
        ErrorReport savedReport = errorReportRepository.save(report);
        log.info("Created error report with ID: {}", savedReport.getId());
        
        return mapToDTO(savedReport);
    }

    /**
     * Get a list of error reports with optional filtering
     * 
     * @param status optional filter by status
     * @param itemId optional filter by case study ID
     * @param errorType optional filter by error type
     * @return list of matching error reports
     */
    public List<ErrorReportDTO> getErrorReports(String status, Integer itemId, String errorType) {
        log.info("Fetching error reports with filters - status: {}, itemId: {}, errorType: {}", 
                status, itemId, errorType);
        
        Specification<ErrorReport> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            
            if (status != null && !status.isEmpty()) {
                predicates.add(cb.equal(root.get("status"), status));
            }
            
            if (errorType != null && !errorType.isEmpty()) {
                predicates.add(cb.equal(root.get("errorType"), errorType));
            }
            
            if (itemId != null) {
                predicates.add(cb.isMember(itemId, root.get("itemIds")));
            }
            
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        
        List<ErrorReport> reports = errorReportRepository.findAll(spec);
        log.info("Found {} error reports matching criteria", reports.size());
        
        return reports.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get an error report by ID
     * 
     * @param id the error report ID
     * @return the error report or null if not found
     */
    public ErrorReportDTO getErrorReportById(Long id) {
        log.info("Fetching error report with ID: {}", id);
        
        return errorReportRepository.findById(id)
                .map(this::mapToDTO)
                .orElse(null);
    }

    /**
     * Update the status of an error report
     * 
     * @param id the error report ID
     * @param status the new status
     * @return the updated error report or null if not found
     */
    public ErrorReportDTO updateErrorReportStatus(Long id, String status) {
        log.info("Updating status of error report ID: {} to: {}", id, status);
        
        if (status == null || (!status.equals("Resolved") && !status.equals("Unresolved") && !status.equals("In Progress"))) {
            log.error("Invalid status: {}. Must be 'Resolved', 'In Progress' or 'Unresolved'", status);
            throw new IllegalArgumentException("Status must be 'Resolved', 'In Progress' or 'Unresolved'");
        }
        
        return errorReportRepository.findById(id)
                .map(report -> {
                    report.setStatus(status);
                    report.setUpdatedAt(LocalDateTime.now());
                    ErrorReport savedReport = errorReportRepository.save(report);
                    log.info("Updated status of error report ID: {}", id);
                    return mapToDTO(savedReport);
                })
                .orElse(null);
    }
    
    /**
     * Update the severity of an error report
     * 
     * @param id the error report ID
     * @param severity the new severity level
     * @return the updated error report or null if not found
     */
    public ErrorReportDTO updateErrorReportSeverity(Long id, String severity) {
        log.info("Updating severity of error report ID: {} to: {}", id, severity);
        
        if (severity == null || (!severity.equals("HIGH") && !severity.equals("MEDIUM") && !severity.equals("LOW"))) {
            log.error("Invalid severity: {}. Must be 'HIGH', 'MEDIUM' or 'LOW'", severity);
            throw new IllegalArgumentException("Severity must be 'HIGH', 'MEDIUM' or 'LOW'");
        }
        
        return errorReportRepository.findById(id)
                .map(report -> {
                    report.setSeverity(severity);
                    report.setUpdatedAt(LocalDateTime.now());
                    ErrorReport savedReport = errorReportRepository.save(report);
                    log.info("Updated severity of error report ID: {}", id);
                    return mapToDTO(savedReport);
                })
                .orElse(null);
    }
    
    /**
     * Generate CSV content for downloading error reports
     * 
     * @param reports list of error reports
     * @return input stream with CSV data
     * @throws IOException if there's an error generating CSV
     */
    public ByteArrayInputStream generateErrorReportsCsv(List<ErrorReportDTO> reports) throws IOException {
        final ByteArrayOutputStream out = new ByteArrayOutputStream();
        OutputStreamWriter writer = new OutputStreamWriter(out, StandardCharsets.UTF_8);
        
        // Write CSV header
        writer.write("Error ID,Error Type,Description,Item IDs,Status,Severity,Created At,Updated At,Reported By\n");
        
        // Write data rows
        for (ErrorReportDTO report : reports) {
            writer.write(String.valueOf(report.getId()));
            writer.write(",");
            writer.write(escapeCsvField(report.getErrorType()));
            writer.write(",");
            writer.write(escapeCsvField(report.getDescription()));
            writer.write(",");
            
            // Format the list of item IDs
            String itemIds = report.getItemIds() != null ? 
                    report.getItemIds().toString().replace("[", "").replace("]", "") : "";
            writer.write(escapeCsvField(itemIds));
            writer.write(",");
            
            writer.write(escapeCsvField(report.getStatus()));
            writer.write(",");
            writer.write(escapeCsvField(report.getSeverity()));
            writer.write(",");
            
            // Format dates
            String createdAt = report.getCreatedAt() != null ? 
                    report.getCreatedAt().format(DATE_FORMATTER) : "";
            writer.write(escapeCsvField(createdAt));
            writer.write(",");
            
            String updatedAt = report.getUpdatedAt() != null ? 
                    report.getUpdatedAt().format(DATE_FORMATTER) : "";
            writer.write(escapeCsvField(updatedAt));
            writer.write(",");
            
            writer.write(escapeCsvField(report.getReporter() != null ? report.getReporter() : ""));
            writer.write("\n");
        }
        
        writer.flush();
        writer.close();
        return new ByteArrayInputStream(out.toByteArray());
    }
    
    /**
     * Escape special characters for CSV format
     */
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

    /**
     * Map entity to DTO
     */
    private ErrorReportDTO mapToDTO(ErrorReport report) {
        return ErrorReportDTO.builder()
                .id(report.getId())
                .itemIds(report.getItemIds())
                .errorType(report.getErrorType())
                .description(report.getDescription())
                .reporter(report.getReporter())
                .status(report.getStatus())
                .severity(report.getSeverity())
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
}