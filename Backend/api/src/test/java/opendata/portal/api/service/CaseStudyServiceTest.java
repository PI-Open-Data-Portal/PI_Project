package opendata.portal.api.service;

import opendata.portal.api.model.CaseStudy;
import opendata.portal.api.model.Agent;
import opendata.portal.api.repository.CaseStudyRepository;
import opendata.portal.api.dto.NST2007_2PStatDTO;
import opendata.portal.api.dto.Prov2PrefixStatDTO;
import opendata.portal.api.dto.WeightStatisticsDTO;
import opendata.portal.api.dto.DisembarkationPortStatDTO;
import opendata.portal.api.dto.PortPairStatDTO;
import opendata.portal.api.dto.OutlierDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.EntityManager;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CaseStudyServiceTest {
    @Mock
    private CaseStudyRepository caseStudyRepository;
    @Mock
    private AgentService agentService;
    @Mock
    private ActivityService activityService;
    @Mock
    private Entity_Service entityService;
    @Mock
    private EntityManager entityManager;
    @InjectMocks
    private CaseStudyService caseStudyService;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        caseStudyService = new CaseStudyService(entityManager);
        // Injetar mocks privados via reflexão
        setPrivateField(caseStudyService, "agentService", agentService);
        setPrivateField(caseStudyService, "activityService", activityService);
        setPrivateField(caseStudyService, "entityService", entityService);
        setPrivateField(caseStudyService, "caseStudyRepository", caseStudyRepository);
    }

    private void setPrivateField(Object target, String fieldName, Object value) throws Exception {
        Field field = target.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        field.set(target, value);
    }

    @Test
    void testGetCaseStudies() {
        CaseStudy cs = new CaseStudy();
        when(caseStudyRepository.findAll()).thenReturn(Collections.singletonList(cs));
        List<CaseStudy> result = caseStudyService.getCaseStudies();
        assertEquals(1, result.size());
    }

    @Test
    void testGetCaseStudyByIdFound() {
        CaseStudy cs = new CaseStudy();
        when(caseStudyRepository.findById(1)).thenReturn(Optional.of(cs));
        assertNotNull(caseStudyService.getCaseStudyById(1));
    }

    @Test
    void testGetCaseStudyByIdNotFound() {
        when(caseStudyRepository.findById(2)).thenReturn(Optional.empty());
        assertNull(caseStudyService.getCaseStudyById(2));
    }

    @Test
    void testGetCasesStudyByProv2() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<CaseStudy> page = new PageImpl<>(Collections.emptyList());
        when(caseStudyRepository.findByProv2StartingWith(pageable, "A")).thenReturn(page);
        Page<CaseStudy> result = caseStudyService.getCasesStudyByProv2(pageable, "A");
        assertEquals(0, result.getTotalElements());
    }

    @Test
    void testGetPaginatedCaseStudies() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<CaseStudy> page = new PageImpl<>(Collections.emptyList());
        when(caseStudyRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        Page<CaseStudy> result = caseStudyService.getPaginatedCaseStudies(pageable, null, null, null, null, null, null, null, null, null);
        assertEquals(0, result.getTotalElements());
    }

    @Test
    void testGetNST2007_2PProductStats() {
        Object[] row = {"A", "B", 1L};
        when(caseStudyRepository.findNST2007_2PProductStats(any(), any(), any(), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        List<NST2007_2PStatDTO> result = caseStudyService.getNST2007_2PProductStats(null, null, null, null, null, null);
        assertEquals(1, result.size());
    }

    @Test
    void testGetNST2007_2PProductStatsInvalidMessage() {
        assertThrows(IllegalArgumentException.class, () ->
            caseStudyService.getNST2007_2PProductStats(null, null, null, "INVALID", null, null));
    }

    @Test
    void testGetProv2PrefixStats() {
        Object[] row = {"A", 2L};
        when(caseStudyRepository.findProv2PrefixStats(any(), any(), any(), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        List<Prov2PrefixStatDTO> result = caseStudyService.getProv2PrefixStats(null, null, null, null, null, null);
        assertEquals(1, result.size());
    }

    @Test
    void testGetProv2PrefixStatsInvalidMessage() {
        assertThrows(IllegalArgumentException.class, () ->
            caseStudyService.getProv2PrefixStats(null, null, null, "INVALID", null, null));
    }

    @Test
    void testGetWeightStatistics() {
        Object[] row = {1.0, 2.0, 3.0};
        when(caseStudyRepository.findWeightStatistics(any(), any(), any(), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        WeightStatisticsDTO result = caseStudyService.getWeightStatistics(null, null, null, null, null, null);
        assertEquals(1.0, result.getMeanWeight());
    }

    @Test
    void testGetWeightStatisticsEmpty() {
        when(caseStudyRepository.findWeightStatistics(any(), any(), any(), any(), any(), any()))
            .thenReturn(Collections.emptyList());
        WeightStatisticsDTO result = caseStudyService.getWeightStatistics(null, null, null, null, null, null);
        assertEquals(0.0, result.getMeanWeight());
    }

    @Test
    void testGetWeightStatisticsInvalidMessage() {
        assertThrows(IllegalArgumentException.class, () ->
            caseStudyService.getWeightStatistics(null, null, null, "INVALID", null, null));
    }

    @Test
    void testGetEmbarkationPortFrequency() {
        Object[] row = {"PORT", 5L};
        when(caseStudyRepository.findDisembarkationPortFrequency()).thenReturn(Collections.singletonList(row));
        List<DisembarkationPortStatDTO> result = caseStudyService.getEmbarkationPortFrequency();
        assertEquals(1, result.size());
    }

    @Test
    void testGetPortPairFrequency() {
        Object[] row = {"A", "B", 10L};
        when(caseStudyRepository.findPortPairFrequency(any(), any(), any(), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        List<PortPairStatDTO> result = caseStudyService.getPortPairFrequency(null, null, null, null, null, null);
        assertEquals(1, result.size());
    }

    @Test
    void testGetPortPairFrequencyInvalidMessage() {
        assertThrows(IllegalArgumentException.class, () ->
            caseStudyService.getPortPairFrequency(null, null, null, "INVALID", null, null));
    }

    @Test
    void testGetOutliers() {
        // Preencher todos os campos para evitar NPE
        OutlierDTO outlier = new OutlierDTO();
        outlier.setWeight(10.0);
        outlier.setID(1);
        outlier.setProv2("prov2");
        outlier.setMovement_Date(java.time.LocalDate.now());
        outlier.setProv("prov");
        when(caseStudyRepository.findOutliers()).thenReturn(Collections.singletonList(new Object[]{10.0, 1, "prov2", java.sql.Date.valueOf(java.time.LocalDate.now()), "prov"}));
        List<OutlierDTO> result = caseStudyService.getOutliers();
        assertNotNull(result);
    }

    @Test
    void testGetOutliersWithFilters() {
        OutlierDTO outlier = new OutlierDTO();
        outlier.setID(1);
        outlier.setProv("A");
        outlier.setWeight(10.0);
        outlier.setProv2("A");
        outlier.setMovement_Date(java.time.LocalDate.now());
        List<OutlierDTO> outliers = Collections.singletonList(outlier);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        List<OutlierDTO> result = spyService.getOutliersWithFilters(null, null, 5.0, 15.0, 1, "A");
        assertEquals(1, result.size());
    }
}
