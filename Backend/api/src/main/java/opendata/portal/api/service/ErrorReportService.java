package opendata.portal.api.service;

import java.time.LocalDateTime;
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
        
        if (status == null || (!status.equals("Resolved") && !status.equals("Unresolved"))) {
            log.error("Invalid status: {}. Must be 'Resolved' or 'Unresolved'", status);
            throw new IllegalArgumentException("Status must be 'Resolved' or 'Unresolved'");
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
                .createdAt(report.getCreatedAt())
                .updatedAt(report.getUpdatedAt())
                .build();
    }
}