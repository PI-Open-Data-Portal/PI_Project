package opendata.portal.api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.jpa.domain.Specification;

import opendata.portal.api.dto.ErrorReportDTO;
import opendata.portal.api.model.ErrorReport;
import opendata.portal.api.repository.ErrorReportRepository;

@ExtendWith(MockitoExtension.class)
public class ErrorReportServiceTest {

    @Mock
    private ErrorReportRepository errorReportRepository;

    @InjectMocks
    private ErrorReportService errorReportService;

    private ErrorReportDTO sampleDTO;
    private ErrorReport sampleEntity;

    @BeforeEach
    void setUp() {
        LocalDateTime now = LocalDateTime.now();
        
        sampleDTO = ErrorReportDTO.builder()
                .id(1L)
                .itemIds(Arrays.asList(100, 200))
                .errorType("DATA_MISSING")
                .description("Test error description")
                .reporter("test@example.com")
                .status("Unresolved")
                .severity("MEDIUM")
                .createdAt(now)
                .updatedAt(now)
                .build();

        sampleEntity = ErrorReport.builder()
                .id(1L)
                .itemIds(Arrays.asList(100, 200))
                .errorType("DATA_MISSING")
                .description("Test error description")
                .reporter("test@example.com")
                .status("Unresolved")
                .severity("MEDIUM")
                .createdAt(now)
                .updatedAt(now)
                .build();
    }

    @Test
    void testCreateErrorReport_Success() {
        // Given
        ErrorReportDTO inputDTO = ErrorReportDTO.builder()
                .itemIds(Arrays.asList(100, 200))
                .errorType("DATA_MISSING")
                .description("Test error description")
                .reporter("test@example.com")
                .build();

        when(errorReportRepository.save(any(ErrorReport.class))).thenReturn(sampleEntity);

        // When
        ErrorReportDTO result = errorReportService.createErrorReport(inputDTO);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("DATA_MISSING", result.getErrorType());
        assertEquals("Test error description", result.getDescription());
        assertEquals("test@example.com", result.getReporter());
        assertEquals("Unresolved", result.getStatus());
        assertEquals("MEDIUM", result.getSeverity());
        
        verify(errorReportRepository).save(any(ErrorReport.class));
    }

    @Test
    void testGetErrorReports_WithoutFilters() {
        // Given
        List<ErrorReport> mockReports = Arrays.asList(sampleEntity);
        when(errorReportRepository.findAll(any(Specification.class))).thenReturn(mockReports);

        // When
        List<ErrorReportDTO> result = errorReportService.getErrorReports(null, null, null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(sampleDTO.getId(), result.get(0).getId());
        
        verify(errorReportRepository).findAll(any(Specification.class));
    }

    @Test
    void testGetErrorReports_WithAllFilters() {
        // Given
        List<ErrorReport> mockReports = Arrays.asList(sampleEntity);
        when(errorReportRepository.findAll(any(Specification.class))).thenReturn(mockReports);

        // When
        List<ErrorReportDTO> result = errorReportService.getErrorReports("Unresolved", 100, "DATA_MISSING");

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        
        verify(errorReportRepository).findAll(any(Specification.class));
    }

    @Test
    void testGetErrorReports_EmptyResult() {
        // Given
        when(errorReportRepository.findAll(any(Specification.class))).thenReturn(Arrays.asList());

        // When
        List<ErrorReportDTO> result = errorReportService.getErrorReports("Resolved", null, null);

        // Then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        
        verify(errorReportRepository).findAll(any(Specification.class));
    }

    @Test
    void testGetErrorReportById_Found() {
        // Given
        when(errorReportRepository.findById(1L)).thenReturn(Optional.of(sampleEntity));

        // When
        ErrorReportDTO result = errorReportService.getErrorReportById(1L);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("DATA_MISSING", result.getErrorType());
        
        verify(errorReportRepository).findById(1L);
    }

    @Test
    void testGetErrorReportById_NotFound() {
        // Given
        when(errorReportRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        ErrorReportDTO result = errorReportService.getErrorReportById(999L);

        // Then
        assertNull(result);
        
        verify(errorReportRepository).findById(999L);
    }

    @Test
    void testUpdateErrorReportStatus_Success() {
        // Given
        when(errorReportRepository.findById(1L)).thenReturn(Optional.of(sampleEntity));
        when(errorReportRepository.save(any(ErrorReport.class))).thenReturn(sampleEntity);

        // When
        ErrorReportDTO result = errorReportService.updateErrorReportStatus(1L, "Resolved");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        
        verify(errorReportRepository).findById(1L);
        verify(errorReportRepository).save(sampleEntity);
    }

    @Test
    void testUpdateErrorReportStatus_NotFound() {
        // Given
        when(errorReportRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        ErrorReportDTO result = errorReportService.updateErrorReportStatus(999L, "Resolved");

        // Then
        assertNull(result);
        
        verify(errorReportRepository).findById(999L);
        verify(errorReportRepository, never()).save(any());
    }

    @Test
    void testUpdateErrorReportStatus_InvalidStatus() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> errorReportService.updateErrorReportStatus(1L, "INVALID_STATUS")
        );
        
        assertEquals("Status must be 'Resolved', 'In Progress' or 'Unresolved'", exception.getMessage());
        
        verify(errorReportRepository, never()).findById(any());
        verify(errorReportRepository, never()).save(any());
    }

    @Test
    void testUpdateErrorReportStatus_NullStatus() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> errorReportService.updateErrorReportStatus(1L, null)
        );
        
        assertEquals("Status must be 'Resolved', 'In Progress' or 'Unresolved'", exception.getMessage());
    }

    @Test
    void testUpdateErrorReportSeverity_Success() {
        // Given
        when(errorReportRepository.findById(1L)).thenReturn(Optional.of(sampleEntity));
        when(errorReportRepository.save(any(ErrorReport.class))).thenReturn(sampleEntity);

        // When
        ErrorReportDTO result = errorReportService.updateErrorReportSeverity(1L, "HIGH");

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        
        verify(errorReportRepository).findById(1L);
        verify(errorReportRepository).save(sampleEntity);
    }

    @Test
    void testUpdateErrorReportSeverity_NotFound() {
        // Given
        when(errorReportRepository.findById(999L)).thenReturn(Optional.empty());

        // When
        ErrorReportDTO result = errorReportService.updateErrorReportSeverity(999L, "HIGH");

        // Then
        assertNull(result);
        
        verify(errorReportRepository).findById(999L);
        verify(errorReportRepository, never()).save(any());
    }

    @Test
    void testUpdateErrorReportSeverity_InvalidSeverity() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> errorReportService.updateErrorReportSeverity(1L, "INVALID_SEVERITY")
        );
        
        assertEquals("Severity must be 'HIGH', 'MEDIUM' or 'LOW'", exception.getMessage());
        
        verify(errorReportRepository, never()).findById(any());
        verify(errorReportRepository, never()).save(any());
    }

    @Test
    void testUpdateErrorReportSeverity_NullSeverity() {
        // When & Then
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> errorReportService.updateErrorReportSeverity(1L, null)
        );
        
        assertEquals("Severity must be 'HIGH', 'MEDIUM' or 'LOW'", exception.getMessage());
    }

    @Test
    void testDeleteErrorReport_Success() {
        // Given
        when(errorReportRepository.existsById(1L)).thenReturn(true);

        // When
        boolean result = errorReportService.deleteErrorReport(1L);

        // Then
        assertTrue(result);
        
        verify(errorReportRepository).existsById(1L);
        verify(errorReportRepository).deleteById(1L);
    }

    @Test
    void testDeleteErrorReport_NotFound() {
        // Given
        when(errorReportRepository.existsById(999L)).thenReturn(false);

        // When
        boolean result = errorReportService.deleteErrorReport(999L);

        // Then
        assertFalse(result);
        
        verify(errorReportRepository).existsById(999L);
        verify(errorReportRepository, never()).deleteById(any());
    }

    @Test
    void testGenerateErrorReportsCsv_Success() throws IOException {
        // Given
        List<ErrorReportDTO> reports = Arrays.asList(sampleDTO);

        // When
        ByteArrayInputStream result = errorReportService.generateErrorReportsCsv(reports);

        // Then
        assertNotNull(result);
        
        // Read the CSV content to verify
        byte[] csvBytes = result.readAllBytes();
        String csvContent = new String(csvBytes);
        
        assertTrue(csvContent.contains("Error ID,Error Type,Description"));
        assertTrue(csvContent.contains("DATA_MISSING"));
        assertTrue(csvContent.contains("Test error description"));
        assertTrue(csvContent.contains("test@example.com"));
    }

    @Test
    void testGenerateErrorReportsCsv_EmptyList() throws IOException {
        // Given
        List<ErrorReportDTO> emptyReports = Arrays.asList();

        // When
        ByteArrayInputStream result = errorReportService.generateErrorReportsCsv(emptyReports);

        // Then
        assertNotNull(result);
        
        byte[] csvBytes = result.readAllBytes();
        String csvContent = new String(csvBytes);
        
        // Should only contain header
        assertTrue(csvContent.contains("Error ID,Error Type,Description"));
        assertEquals(1, csvContent.split("\n").length); // Only header line
    }

    @Test
    void testGenerateErrorReportsCsv_WithSpecialCharacters() throws IOException {
        // Given
        ErrorReportDTO specialDTO = ErrorReportDTO.builder()
                .id(2L)
                .itemIds(Arrays.asList(300))
                .errorType("SPECIAL,TYPE")
                .description("Description with \"quotes\" and\nnewlines")
                .reporter("test@example.com")
                .status("Unresolved")
                .severity("HIGH")
                .createdAt(LocalDateTime.now())
                .build();
        
        List<ErrorReportDTO> reports = Arrays.asList(specialDTO);

        // When
        ByteArrayInputStream result = errorReportService.generateErrorReportsCsv(reports);

        // Then
        assertNotNull(result);
        
        byte[] csvBytes = result.readAllBytes();
        String csvContent = new String(csvBytes);
        
        // Should properly escape special characters
        assertTrue(csvContent.contains("\"SPECIAL,TYPE\""));
        assertTrue(csvContent.contains("\"Description with \"\"quotes\"\" and\nnewlines\""));
    }

    @Test
    void testGenerateErrorReportsCsv_WithNullValues() throws IOException {
        // Given
        ErrorReportDTO nullDTO = ErrorReportDTO.builder()
                .id(3L)
                .itemIds(null)
                .errorType(null)
                .description(null)
                .reporter(null)
                .status(null)
                .severity(null)
                .createdAt(null)
                .updatedAt(null)
                .build();
        
        List<ErrorReportDTO> reports = Arrays.asList(nullDTO);

        // When
        ByteArrayInputStream result = errorReportService.generateErrorReportsCsv(reports);

        // Then
        assertNotNull(result);
        
        byte[] csvBytes = result.readAllBytes();
        String csvContent = new String(csvBytes);
        
        // Should handle null values gracefully
        assertTrue(csvContent.contains("3,,,,,,,,")); // ID followed by empty fields
    }

    @Test
    void testValidStatusValues() {
        // Test all valid status values
        when(errorReportRepository.findById(1L)).thenReturn(Optional.of(sampleEntity));
        when(errorReportRepository.save(any(ErrorReport.class))).thenReturn(sampleEntity);

        assertDoesNotThrow(() -> errorReportService.updateErrorReportStatus(1L, "Resolved"));
        assertDoesNotThrow(() -> errorReportService.updateErrorReportStatus(1L, "Unresolved"));
        assertDoesNotThrow(() -> errorReportService.updateErrorReportStatus(1L, "In Progress"));
    }

    @Test
    void testValidSeverityValues() {
        // Test all valid severity values
        when(errorReportRepository.findById(1L)).thenReturn(Optional.of(sampleEntity));
        when(errorReportRepository.save(any(ErrorReport.class))).thenReturn(sampleEntity);

        assertDoesNotThrow(() -> errorReportService.updateErrorReportSeverity(1L, "HIGH"));
        assertDoesNotThrow(() -> errorReportService.updateErrorReportSeverity(1L, "MEDIUM"));
        assertDoesNotThrow(() -> errorReportService.updateErrorReportSeverity(1L, "LOW"));
    }
}