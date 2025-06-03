package opendata.portal.api.controller;

import opendata.portal.api.dto.ErrorReportDTO;
import opendata.portal.api.service.ErrorReportService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ErrorReportController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ErrorReportControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ErrorReportService errorReportService;

    private ErrorReportDTO errorReportDTO;

    @BeforeEach
    void setUp() {
        errorReportDTO = ErrorReportDTO.builder()
                .id(1L)
                .errorType("Type")
                .description("desc")
                .reporter("user")
                .status("open")
                .createdAt(LocalDateTime.now())
                .severity("MEDIUM")
                .build();
    }

    @Test
    void testGetAllErrorReports() throws Exception {
        List<ErrorReportDTO> reports = Collections.singletonList(errorReportDTO);
        given(errorReportService.getErrorReports(null, null, null)).willReturn(reports);
        mockMvc.perform(get("/apiV1/errorReports"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetErrorReportByIdFound() throws Exception {
        given(errorReportService.getErrorReportById(1L)).willReturn(errorReportDTO);
        mockMvc.perform(get("/apiV1/errorReports/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetErrorReportByIdNotFound() throws Exception {
        given(errorReportService.getErrorReportById(2L)).willReturn(null);
        mockMvc.perform(get("/apiV1/errorReports/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteErrorReportFound() throws Exception {
        given(errorReportService.deleteErrorReport(1L)).willReturn(true);
        mockMvc.perform(delete("/apiV1/errorReports/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteErrorReportNotFound() throws Exception {
        given(errorReportService.deleteErrorReport(2L)).willReturn(false);
        mockMvc.perform(delete("/apiV1/errorReports/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateErrorReport() throws Exception {
        ErrorReportDTO input = ErrorReportDTO.builder().description("desc").errorType("Type").status("open").build();
        given(errorReportService.createErrorReport(input)).willReturn(errorReportDTO);
        mockMvc.perform(post("/apiV1/errorReports")
                .contentType("application/json")
                .content("{\"description\":\"desc\",\"errorType\":\"Type\",\"status\":\"open\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void testUpdateErrorStatusFound() throws Exception {
        given(errorReportService.updateErrorReportStatus(1L, "closed")).willReturn(errorReportDTO);
        mockMvc.perform(patch("/apiV1/errorReports/1")
                .contentType("application/json")
                .content("{\"status\":\"closed\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateErrorStatusNotFound() throws Exception {
        given(errorReportService.updateErrorReportStatus(2L, "closed")).willReturn(null);
        mockMvc.perform(patch("/apiV1/errorReports/2")
                .contentType("application/json")
                .content("{\"status\":\"closed\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testUpdateErrorSeverityFound() throws Exception {
        given(errorReportService.updateErrorReportSeverity(1L, "HIGH")).willReturn(errorReportDTO);
        mockMvc.perform(put("/apiV1/errorReports")
                .contentType("application/json")
                .content("{\"errorId\":1,\"severity\":\"HIGH\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void testUpdateErrorSeverityNotFound() throws Exception {
        given(errorReportService.updateErrorReportSeverity(2L, "HIGH")).willReturn(null);
        mockMvc.perform(put("/apiV1/errorReports")
                .contentType("application/json")
                .content("{\"errorId\":2,\"severity\":\"HIGH\"}"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDownloadErrorReports() throws Exception {
        given(errorReportService.getErrorReports(null, null, null)).willReturn(Collections.singletonList(errorReportDTO));
        mockMvc.perform(get("/apiV1/errorReports/download"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetErrorReportsWithFilters() throws Exception {
        given(errorReportService.getErrorReports("open", 1, "Type")).willReturn(Collections.singletonList(errorReportDTO));
        mockMvc.perform(get("/apiV1/errorReports?status=open&itemId=1&errorType=Type"))
                .andExpect(status().isOk());
    }
}
