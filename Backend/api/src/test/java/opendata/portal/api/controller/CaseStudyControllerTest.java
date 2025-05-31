package opendata.portal.api.controller;

import opendata.portal.api.dto.DisembarkationPortStatDTO;
import opendata.portal.api.dto.NST2007_2PStatDTO;
import opendata.portal.api.dto.OutlierDTO;
import opendata.portal.api.dto.PortPairStatDTO;
import opendata.portal.api.dto.Prov2PrefixStatDTO;
import opendata.portal.api.dto.WeightStatisticsDTO;
import opendata.portal.api.model.CaseStudy;
import opendata.portal.api.service.CaseStudyService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.BDDMockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CaseStudyApiController.class)
@AutoConfigureMockMvc(addFilters = false)
public class CaseStudyControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CaseStudyService caseStudyService;

    private CaseStudy caseStudy;

    @BeforeEach
    void setUp() throws Exception {
        caseStudy = new CaseStudy();
        // Define o id via reflexão, pois não há setter
        Field idField = CaseStudy.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(caseStudy, 1);
        // ... outros campos se necessário
    }

    @Test
    void testGetCaseStudyByIdFound() throws Exception {
        given(caseStudyService.getCaseStudyById(1)).willReturn(caseStudy);
        mockMvc.perform(get("/apiV1/casestudy/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(caseStudy.getId()));
    }

    @Test
    void testGetCaseStudyByIdNotFound() throws Exception {
        given(caseStudyService.getCaseStudyById(2)).willReturn(null);
        mockMvc.perform(get("/apiV1/casestudy/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetAllCaseStudiesPaged() throws Exception {
        Page<CaseStudy> page = new PageImpl<>(Collections.singletonList(caseStudy));
        // O assembler é usado no controller real, mas aqui simulamos apenas o retorno do service
        given(caseStudyService.getPaginatedCaseStudies(any(Pageable.class), any(), any(), any(), any(), any(), any(), any(), any(), any()))
                .willReturn(page);
        mockMvc.perform(get("/apiV1/casestudy"))
                .andExpect(status().isOk()); // Não valida o conteúdo pois depende do assembler
    }

    @Test
    void testGetNST2007_2PProductStats() throws Exception {
        List<NST2007_2PStatDTO> stats = Arrays.asList(new NST2007_2PStatDTO("01", "Label", 1L));
        given(caseStudyService.getNST2007_2PProductStats(any(), any(), any(), any(), any(), any())).willReturn(stats);
        mockMvc.perform(get("/apiV1/casestudy/2p-products"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetProv2PrefixStats() throws Exception {
        List<Prov2PrefixStatDTO> stats = Arrays.asList(new Prov2PrefixStatDTO("T", 1L));
        given(caseStudyService.getProv2PrefixStats(any(), any(), any(), any(), any(), any())).willReturn(stats);
        mockMvc.perform(get("/apiV1/casestudy/prov2-prefix"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetWeightStatistics() throws Exception {
        given(caseStudyService.getWeightStatistics(any(), any(), any(), any(), any(), any())).willReturn(new WeightStatisticsDTO(1.0,2.0,3.0));
        mockMvc.perform(get("/apiV1/casestudy/weight-statistics"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetPortPairFrequency() throws Exception {
        List<PortPairStatDTO> stats = Arrays.asList(new PortPairStatDTO("A","B",1L));
        given(caseStudyService.getPortPairFrequency(any(), any(), any(), any(), any(), any())).willReturn(stats);
        mockMvc.perform(get("/apiV1/casestudy/v2/port-pairs"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetEmbarkationPortFrequency() throws Exception {
        List<DisembarkationPortStatDTO> stats = Arrays.asList(new DisembarkationPortStatDTO("PORT", 1L));
        given(caseStudyService.getEmbarkationPortFrequency()).willReturn(stats);
        mockMvc.perform(get("/apiV1/casestudy/embarkation-ports"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetOutliers() throws Exception {
        List<OutlierDTO> outliers = Arrays.asList(new OutlierDTO());
        given(caseStudyService.getOutliersWithFilters(any(), any(), any(), any(), any(), any())).willReturn(outliers);
        mockMvc.perform(get("/apiV1/casestudy/outliers"))
                .andExpect(status().isOk());
    }

    @Test
    void testDownloadCaseStudies() throws Exception {
        given(caseStudyService.downloadCaseStudies(any(), any(), any(), any(), any(), any(), any(), any(), any())).willReturn(new byte[]{1,2,3});
        mockMvc.perform(get("/apiV1/casestudy/download?format=json"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetCaseStudiesByProv() throws Exception {
        Page<CaseStudy> page = new PageImpl<>(Collections.singletonList(caseStudy));
        given(caseStudyService.getCasesStudyByProv2(any(Pageable.class), any())).willReturn(page);
        mockMvc.perform(get("/apiV1/casestudy/prov/T"))
                .andExpect(status().isOk());
    }
}
