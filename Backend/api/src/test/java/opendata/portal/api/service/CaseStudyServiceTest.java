package opendata.portal.api.service;

import opendata.portal.api.model.CaseStudy;
import opendata.portal.api.model.Agent;
import opendata.portal.api.model.Activity;
import opendata.portal.api.model.Entity_;
import opendata.portal.api.repository.CaseStudyRepository;
import opendata.portal.api.dto.NST2007_2PStatDTO;
import opendata.portal.api.dto.Prov2PrefixStatDTO;
import opendata.portal.api.dto.WeightStatisticsDTO;
import opendata.portal.api.dto.DisembarkationPortStatDTO;
import opendata.portal.api.dto.PortPairStatDTO;
import opendata.portal.api.dto.OutlierDTO;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import jakarta.persistence.Tuple;
import jakarta.persistence.TupleElement;

import java.lang.reflect.Field;
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
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
    
    @Mock
    private Query query;
    
    @Mock
    private Tuple tuple;
    
    @Mock
    private TupleElement<String> tupleElement;
    
    @InjectMocks
    private CaseStudyService caseStudyService;

    @BeforeEach
    void setUp() throws Exception {
        MockitoAnnotations.openMocks(this);
        caseStudyService = new CaseStudyService(entityManager);
        
        // Inject private fields via reflection
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
    void testGetCaseStudyByIdNotFound() {
        when(caseStudyRepository.findById(2)).thenReturn(Optional.empty());
        
        CaseStudy result = caseStudyService.getCaseStudyById(2);
        
        assertNull(result);
        verify(caseStudyRepository).findById(2);
    }

    @Test
    void testGetCasesStudyByProv2() {
        Pageable pageable = PageRequest.of(0, 10);
        CaseStudy cs = new CaseStudy();
        Page<CaseStudy> page = new PageImpl<>(Collections.singletonList(cs));
        when(caseStudyRepository.findByProv2StartingWith(pageable, "ABC")).thenReturn(page);
        
        Page<CaseStudy> result = caseStudyService.getCasesStudyByProv2(pageable, "ABC");
        
        assertEquals(1, result.getTotalElements());
        verify(caseStudyRepository).findByProv2StartingWith(pageable, "ABC");
    }

    // Paginated Query Tests
    @Test
    void testGetPaginatedCaseStudiesWithAllFilters() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<CaseStudy> page = new PageImpl<>(Collections.emptyList());
        when(caseStudyRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(page);
        
        LocalDate startDate = LocalDate.of(2023, 1, 1);
        LocalDate endDate = LocalDate.of(2023, 12, 31);
        
        Page<CaseStudy> result = caseStudyService.getPaginatedCaseStudies(
            pageable, startDate, endDate, true, "ARRIVAL_ANNOUNCEMENT", 
            "PORT1,PORT2", "PORT3,PORT4", "ABC", "1234", "PLATE123");
        
        assertEquals(0, result.getTotalElements());
        verify(caseStudyRepository).findAll(any(Specification.class), eq(pageable));
    }

    @Test
    void testGetPaginatedCaseStudiesWithInvalidMessage() {
        Pageable pageable = PageRequest.of(0, 10);
        
        assertThrows(IllegalArgumentException.class, () ->
            caseStudyService.getPaginatedCaseStudies(pageable, null, null, null, 
                "INVALID_MESSAGE", null, null, null, null, null));
    }

    // Statistics Tests
    @Test
    void testGetNST2007_2PProductStatsValidMessage() {
        Object[] row = {"ProductA", "LabelA", 100L};
        when(caseStudyRepository.findNST2007_2PProductStats(any(), any(), any(), eq("ARRIVAL_ANNOUNCEMENT"), any(), any()))
            .thenReturn(Collections.singletonList(row));
        
        List<NST2007_2PStatDTO> result = caseStudyService.getNST2007_2PProductStats(
            null, null, true, "ARRIVAL_ANNOUNCEMENT", null, null);
        
        assertEquals(1, result.size());
        assertEquals(100L, result.get(0).getCount());
    }

    @Test
    void testGetNST2007_2PProductStatsInvalidMessage() {
        assertThrows(IllegalArgumentException.class, () ->
            caseStudyService.getNST2007_2PProductStats(null, null, null, "INVALID_MESSAGE", null, null));
    }

    @Test
    void testGetNST2007_2PProductStatsWithTranshipmentTrue() {
        Object[] row = {"ProductA", "LabelA", 50L};
        when(caseStudyRepository.findNST2007_2PProductStats(any(), any(), eq("S"), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        
        List<NST2007_2PStatDTO> result = caseStudyService.getNST2007_2PProductStats(
            null, null, true, null, null, null);
        
        assertEquals(1, result.size());
        verify(caseStudyRepository).findNST2007_2PProductStats(any(), any(), eq("S"), any(), any(), any());
    }

    @Test
    void testGetNST2007_2PProductStatsWithTranshipmentFalse() {
        Object[] row = {"ProductB", "LabelB", 75L};
        when(caseStudyRepository.findNST2007_2PProductStats(any(), any(), eq("N"), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        
        List<NST2007_2PStatDTO> result = caseStudyService.getNST2007_2PProductStats(
            null, null, false, null, null, null);
        
        assertEquals(1, result.size());
        verify(caseStudyRepository).findNST2007_2PProductStats(any(), any(), eq("N"), any(), any(), any());
    }

    @Test
    void testGetProv2PrefixStatsValid() {
        Object[] row = {"PREFIX_A", 25L};
        when(caseStudyRepository.findProv2PrefixStats(any(), any(), any(), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        
        List<Prov2PrefixStatDTO> result = caseStudyService.getProv2PrefixStats(
            LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31), null, null, null, null);
        
        assertEquals(1, result.size());
        assertEquals(25L, result.get(0).getCount());
    }

    @Test
    void testGetProv2PrefixStatsInvalidMessage() {
        assertThrows(IllegalArgumentException.class, () ->
            caseStudyService.getProv2PrefixStats(null, null, null, "INVALID_MESSAGE", null, null));
    }

    @Test
    void testGetWeightStatisticsValid() {
        Object[] row = {100.5, 50.2, 200.8};
        when(caseStudyRepository.findWeightStatistics(any(), any(), any(), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        
        WeightStatisticsDTO result = caseStudyService.getWeightStatistics(null, null, null, null, null, null);
        
        assertEquals(100.5, result.getMeanWeight());
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
            caseStudyService.getWeightStatistics(null, null, null, "INVALID_MESSAGE", null, null));
    }

    @Test
    void testGetEmbarkationPortFrequency() {
        Object[] row = {"PORT_LISBON", 150L};
        when(caseStudyRepository.findDisembarkationPortFrequency())
            .thenReturn(Collections.singletonList(row));
        
        List<DisembarkationPortStatDTO> result = caseStudyService.getEmbarkationPortFrequency();
        
        assertEquals(1, result.size());
        assertEquals(150L, result.get(0).getCount());
    }

    @Test
    void testGetPortPairFrequencyValid() {
        Object[] row = {"PORT_A", "PORT_B", 30L};
        when(caseStudyRepository.findPortPairFrequency(any(), any(), any(), any(), any(), any()))
            .thenReturn(Collections.singletonList(row));
        
        List<PortPairStatDTO> result = caseStudyService.getPortPairFrequency(
            null, null, null, "DEPARTURE_GUIDE", null, null);
        
        assertEquals(1, result.size());
        assertEquals("PORT_A", result.get(0).getEmbarkationPort());
        assertEquals("PORT_B", result.get(0).getDisembarkationPort());
        assertEquals(30L, result.get(0).getCount());
    }

    @Test
    void testGetPortPairFrequencyInvalidMessage() {
        assertThrows(IllegalArgumentException.class, () ->
            caseStudyService.getPortPairFrequency(null, null, null, "INVALID_MESSAGE", null, null));
    }

    // Outliers Tests
    @Test
    void testGetOutliers() {
        LocalDate testDate = LocalDate.of(2023, 6, 15);
        Date sqlDate = Date.valueOf(testDate);
        Object[] row = {150.5, 42, "ABC123", sqlDate, "PROV_A"};
        
        when(caseStudyRepository.findOutliers()).thenReturn(Collections.singletonList(row));
        
        List<OutlierDTO> result = caseStudyService.getOutliers();
        
        assertEquals(1, result.size());
        OutlierDTO outlier = result.get(0);
        assertEquals(150.5, outlier.getWeight());
        assertEquals(42, outlier.getID());
        assertEquals("ABC123", outlier.getProv2());
        assertEquals(testDate, outlier.getMovement_Date());
        assertEquals("PROV_A", outlier.getProv());
    }

    @Test
    void testGetOutliersEmpty() {
        when(caseStudyRepository.findOutliers()).thenReturn(Collections.emptyList());
        
        List<OutlierDTO> result = caseStudyService.getOutliers();
        
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetOutliersWithFiltersDateRange() {
        OutlierDTO outlier1 = createOutlierDTO(1, 10.0, "A123", LocalDate.of(2023, 5, 1), "PROV_A");
        OutlierDTO outlier2 = createOutlierDTO(2, 20.0, "B456", LocalDate.of(2023, 7, 1), "PROV_B");
        OutlierDTO outlier3 = createOutlierDTO(3, 30.0, "C789", LocalDate.of(2023, 9, 1), "PROV_C");
        
        List<OutlierDTO> outliers = Arrays.asList(outlier1, outlier2, outlier3);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        
        LocalDate startDate = LocalDate.of(2023, 6, 1);
        LocalDate endDate = LocalDate.of(2023, 8, 1);
        
        List<OutlierDTO> result = spyService.getOutliersWithFilters(startDate, endDate, null, null, null, null);
        
        assertEquals(1, result.size());
        assertEquals(2, result.get(0).getID());
    }

    @Test
    void testGetOutliersWithFiltersWeightRange() {
        OutlierDTO outlier1 = createOutlierDTO(1, 5.0, "A123", LocalDate.now(), "PROV_A");
        OutlierDTO outlier2 = createOutlierDTO(2, 15.0, "B456", LocalDate.now(), "PROV_B");
        OutlierDTO outlier3 = createOutlierDTO(3, 25.0, "C789", LocalDate.now(), "PROV_C");
        
        List<OutlierDTO> outliers = Arrays.asList(outlier1, outlier2, outlier3);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        
        List<OutlierDTO> result = spyService.getOutliersWithFilters(null, null, 10.0, 20.0, null, null);
        
        assertEquals(1, result.size());
        assertEquals(2, result.get(0).getID());
    }

    @Test
    void testGetOutliersWithFiltersById() {
        OutlierDTO outlier1 = createOutlierDTO(1, 10.0, "A123", LocalDate.now(), "PROV_A");
        OutlierDTO outlier2 = createOutlierDTO(2, 20.0, "B456", LocalDate.now(), "PROV_B");
        OutlierDTO outlier3 = createOutlierDTO(3, 30.0, "C789", LocalDate.now(), "PROV_C");
        
        List<OutlierDTO> outliers = Arrays.asList(outlier1, outlier2, outlier3);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        
        List<OutlierDTO> result = spyService.getOutliersWithFilters(null, null, null, null, 2, null);
        
        assertEquals(1, result.size());
        assertEquals(2, result.get(0).getID());
    }

    @Test
    void testGetOutliersWithFiltersProvType() {
        OutlierDTO outlier1 = createOutlierDTO(1, 10.0, "ABC123", LocalDate.now(), "PROV_A");
        OutlierDTO outlier2 = createOutlierDTO(2, 20.0, "XYZ456", LocalDate.now(), "PROV_B");
        OutlierDTO outlier3 = createOutlierDTO(3, 30.0, "ABC789", LocalDate.now(), "PROV_C");
        
        List<OutlierDTO> outliers = Arrays.asList(outlier1, outlier2, outlier3);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        
        List<OutlierDTO> result = spyService.getOutliersWithFilters(null, null, null, null, null, "ABC");
        
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(o -> o.getProv2().replaceAll("[^A-Za-z]", "").equals("ABC")));
    }

    @Test
    void testGetOutliersWithFiltersAllCombined() {
        OutlierDTO outlier1 = createOutlierDTO(1, 15.0, "ABC123", LocalDate.of(2023, 6, 1), "PROV_A");
        OutlierDTO outlier2 = createOutlierDTO(2, 25.0, "XYZ456", LocalDate.of(2023, 7, 1), "PROV_B");
        OutlierDTO outlier3 = createOutlierDTO(3, 35.0, "ABC789", LocalDate.of(2023, 8, 1), "PROV_C");
        
        List<OutlierDTO> outliers = Arrays.asList(outlier1, outlier2, outlier3);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        
        List<OutlierDTO> result = spyService.getOutliersWithFilters(
            LocalDate.of(2023, 5, 1), LocalDate.of(2023, 8, 31), 
            10.0, 30.0, null, "ABC");
        
        assertEquals(1, result.size());
        assertEquals(1, result.get(0).getID());
    }

    @Test
    void testGetOutliersWithFiltersNoMatches() {
        OutlierDTO outlier1 = createOutlierDTO(1, 10.0, "ABC123", LocalDate.now(), "PROV_A");
        
        List<OutlierDTO> outliers = Collections.singletonList(outlier1);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        
        List<OutlierDTO> result = spyService.getOutliersWithFilters(null, null, 20.0, 30.0, null, null);
        
        assertTrue(result.isEmpty());
    }

    // Download Tests (Basic Structure Tests)
    @Test
    void testDownloadCaseStudiesWithException() throws Exception {
        // Mock agent service to return null to trigger the warning path
        when(agentService.getAgentById(1)).thenReturn(null);
        
        // Mock empty query results
        when(entityManager.createNativeQuery(anyString(), eq(Tuple.class))).thenReturn(query);
        when(query.getResultList()).thenReturn(Collections.emptyList());
        
        byte[] result = caseStudyService.downloadCaseStudies(
            null, null, null, null, null, null, null, 
            Arrays.asList("id", "containerPlate"), "json");
        
        assertNotNull(result);
        // Verify that the method completes even when provenance logging fails
    }

    // Edge Cases and Validation Tests
    @Test
    void testIsValidMessageAllValidMessages() {
        // Test all valid message types
        String[] validMessages = {
            "ARRIVAL_ANNOUNCEMENT", "ARRIVAL_GUIDE", "DECONSOLIDATION_GUIDE",
            "DEPARTURE_GUIDE", "DISEMBARKATION_REPORT", "EMBARKATION_REPORT",
            "LOAD_INSTRUCTION", "LOAD_REPORT", "UNLOAD_INSTRUCTION", "UNLOAD_REPORT",
            "VERIFIED_WEIGHING"
        };
        
        for (String message : validMessages) {
            // Test each valid message doesn't throw exception
            assertDoesNotThrow(() -> 
                caseStudyService.getNST2007_2PProductStats(null, null, null, message, null, null));
        }
    }

    @Test
    void testMultipleInvalidMessages() {
        String[] invalidMessages = {"INVALID1", "INVALID2", "", "   ", "NULL_MESSAGE"};
        
        for (String message : invalidMessages) {
            assertThrows(IllegalArgumentException.class, () ->
                caseStudyService.getNST2007_2PProductStats(null, null, null, message, null, null));
        }
    }

    // Helper Methods
    private OutlierDTO createOutlierDTO(int id, double weight, String prov2, LocalDate date, String prov) {
        OutlierDTO outlier = new OutlierDTO();
        outlier.setID(id);
        outlier.setWeight(weight);
        outlier.setProv2(prov2);
        outlier.setMovement_Date(date);
        outlier.setProv(prov);
        return outlier;
    }

    // Constructor Test
    @Test
    void testConstructorWithEntityManager() {
        EntityManager testEntityManager = mock(EntityManager.class);
        CaseStudyService service = new CaseStudyService(testEntityManager);
        assertNotNull(service);
    }

    // Null Handling Tests
    @Test
    void testGetOutliersWithNullDates() {
        OutlierDTO outlier = createOutlierDTO(1, 10.0, "ABC123", null, "PROV_A");
        
        List<OutlierDTO> outliers = Collections.singletonList(outlier);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        
        // Should not throw exception with null dates
        List<OutlierDTO> result = spyService.getOutliersWithFilters(
            LocalDate.of(2023, 1, 1), LocalDate.of(2023, 12, 31), null, null, null, null);
        
        assertEquals(1, result.size()); // Null dates should pass date filters
    }

    @Test
    void testGetOutliersWithNullProv2() {
        OutlierDTO outlier = createOutlierDTO(1, 10.0, null, LocalDate.now(), "PROV_A");
        
        List<OutlierDTO> outliers = Collections.singletonList(outlier);
        CaseStudyService spyService = spy(caseStudyService);
        doReturn(outliers).when(spyService).getOutliers();
        
        List<OutlierDTO> result = spyService.getOutliersWithFilters(null, null, null, null, null, "ABC");
        
        assertTrue(result.isEmpty()); // Null prov2 should not match any provType filter
    }
}