package opendata.portal.api.service;

import opendata.portal.api.model.ShipDataEnhancement;
import opendata.portal.api.model.ShipDataEnhancementId;
import opendata.portal.api.model.Activity;
import opendata.portal.api.model.Agent;
import opendata.portal.api.model.Entity_;
import opendata.portal.api.repository.ShipDataEnhancementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ShipDataEnhancementServiceTest {

    @Mock
    private ShipDataEnhancementRepository shipDataEnhancementRepository;

    @Mock
    private ActivityService activityService;

    @Mock
    private AgentService agentService;

    @Mock
    private Entity_Service entityService;

    @InjectMocks
    private ShipDataEnhancementService shipDataEnhancementService;

    private ShipDataEnhancementId testId;
    private ShipDataEnhancement testShipData;
    private Agent testAgent;

    @BeforeEach
    void setUp() {
        // Setup test data
        testId = new ShipDataEnhancementId(12345.0, "1.0");
        
        testShipData = new ShipDataEnhancement();
        testShipData.setId(testId);
        testShipData.setShipName("Test Ship");
        testShipData.setShipType("Container Ship");
        testShipData.setDeadweight(50000.0);

        testAgent = new Agent();
        testAgent.setId(2);
    }

    @Test
    void testGetPaginatedShipData_Success() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        ShipDataEnhancement ship1 = new ShipDataEnhancement();
        ShipDataEnhancement ship2 = new ShipDataEnhancement();
        Page<ShipDataEnhancement> expectedPage = new PageImpl<>(Arrays.asList(ship1, ship2));
        
        when(shipDataEnhancementRepository.findAll(pageable)).thenReturn(expectedPage);

        // Act
        Page<ShipDataEnhancement> result = shipDataEnhancementService.getPaginatedShipData(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(2, result.getContent().size());
        verify(shipDataEnhancementRepository).findAll(pageable);
    }

    @Test
    void testProcessAndDeleteShipData_Success() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        assertDoesNotThrow(() -> shipDataEnhancementService.processAndDeleteShipData(testId));

        // Assert
        verify(shipDataEnhancementRepository).findById(testId);
        verify(agentService).getAgentById(2);
        verify(entityService).saveEntity(any(Entity_.class));
        verify(activityService).saveActivity(any(Activity.class));
        verify(shipDataEnhancementRepository).delete(testShipData);
    }

    @Test
    void testProcessAndDeleteShipData_ShipDataNotFound() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.empty());

        // Act & Assert
        EntityNotFoundException exception = assertThrows(
            EntityNotFoundException.class,
            () -> shipDataEnhancementService.processAndDeleteShipData(testId)
        );

        assertTrue(exception.getMessage().contains("ShipDataEnhancement not found"));
        verify(shipDataEnhancementRepository).findById(testId);
        verify(agentService, never()).getAgentById(anyInt());
        verify(entityService, never()).saveEntity(any());
        verify(activityService, never()).saveActivity(any());
        verify(shipDataEnhancementRepository, never()).delete(any());
    }

    @Test
    void testProcessAndDeleteShipData_AgentNotFound() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(null);

        // Act & Assert
        EntityNotFoundException exception = assertThrows(
            EntityNotFoundException.class,
            () -> shipDataEnhancementService.processAndDeleteShipData(testId)
        );

        assertTrue(exception.getMessage().contains("Agent with ID 2 not found"));
        verify(shipDataEnhancementRepository).findById(testId);
        verify(agentService).getAgentById(2);
        verify(entityService, never()).saveEntity(any());
        verify(activityService, never()).saveActivity(any());
        verify(shipDataEnhancementRepository, never()).delete(any());
    }

    @Test
    void testProcessAndDeleteShipData_VerifyEntityCreation() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        shipDataEnhancementService.processAndDeleteShipData(testId);

        // Assert - Verify Entity_ creation with correct properties
        verify(entityService).saveEntity(argThat(entity -> {
            assertEquals("DeletedShipDataRecord", entity.getType());
            assertTrue(entity.getDescription().contains("Provenance record for deleted ShipDataEnhancement"));
            assertTrue(entity.getDescription().contains("IMOCode:12345.0,VersionNumber:1.0"));
            assertTrue(entity.getResourcePath().contains("PRJ_LEI_2025.dbo.ShipDataEnhancement4"));
            assertNotNull(entity.getCreationDate());
            return true;
        }));
    }

    @Test
    void testProcessAndDeleteShipData_VerifyActivityCreation() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        shipDataEnhancementService.processAndDeleteShipData(testId);

        // Assert - Verify Activity creation with correct properties
        verify(activityService).saveActivity(argThat(activity -> {
            assertEquals("DataDeletionOperation", activity.getType());
            assertTrue(activity.getDescription().contains("Deletion of ShipDataEnhancement record"));
            assertTrue(activity.getDescription().contains("IMOCode:12345.0,VersionNumber:1.0"));
            assertNotNull(activity.getStartedDate());
            assertNotNull(activity.getEndDate());
            assertTrue(activity.getAssociatedAgents().contains(testAgent));
            return true;
        }));
    }

    @Test
    void testProcessAndApproveShipData_Success() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        assertDoesNotThrow(() -> shipDataEnhancementService.processAndApproveShipData(testId));

        // Assert
        verify(shipDataEnhancementRepository).findById(testId);
        verify(agentService).getAgentById(2);
        verify(entityService).saveEntity(any(Entity_.class));
        verify(activityService).saveActivity(any(Activity.class));
        verify(shipDataEnhancementRepository).delete(testShipData);
    }

    @Test
    void testProcessAndApproveShipData_ShipDataNotFound() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.empty());

        // Act & Assert
        EntityNotFoundException exception = assertThrows(
            EntityNotFoundException.class,
            () -> shipDataEnhancementService.processAndApproveShipData(testId)
        );

        assertTrue(exception.getMessage().contains("ShipDataEnhancement not found"));
        verify(shipDataEnhancementRepository).findById(testId);
        verify(agentService, never()).getAgentById(anyInt());
        verify(entityService, never()).saveEntity(any());
        verify(activityService, never()).saveActivity(any());
        verify(shipDataEnhancementRepository, never()).delete(any());
    }

    @Test
    void testProcessAndApproveShipData_AgentNotFound() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(null);

        // Act & Assert
        EntityNotFoundException exception = assertThrows(
            EntityNotFoundException.class,
            () -> shipDataEnhancementService.processAndApproveShipData(testId)
        );

        assertTrue(exception.getMessage().contains("Agent with ID 2 not found"));
        verify(shipDataEnhancementRepository).findById(testId);
        verify(agentService).getAgentById(2);
        verify(entityService, never()).saveEntity(any());
        verify(activityService, never()).saveActivity(any());
        verify(shipDataEnhancementRepository, never()).delete(any());
    }

    @Test
    void testProcessAndApproveShipData_VerifyEntityCreation() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        shipDataEnhancementService.processAndApproveShipData(testId);

        // Assert - Verify Entity_ creation with correct properties for approval
        verify(entityService).saveEntity(argThat(entity -> {
            assertEquals("ApprovedShipDataRecord", entity.getType());
            assertTrue(entity.getDescription().contains("Provenance record for approved ShipDataEnhancement"));
            assertTrue(entity.getDescription().contains("IMOCode:12345.0,VersionNumber:1.0"));
            assertTrue(entity.getResourcePath().contains("PRJ_LEI_2025.dbo.ShipDataEnhancement4"));
            assertNotNull(entity.getCreationDate());
            return true;
        }));
    }

    @Test
    void testProcessAndApproveShipData_VerifyActivityCreation() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        shipDataEnhancementService.processAndApproveShipData(testId);

        // Assert - Verify Activity creation with correct properties for approval
        verify(activityService).saveActivity(argThat(activity -> {
            assertEquals("DataApprovalOperation", activity.getType());
            assertTrue(activity.getDescription().contains("Approval of ShipDataEnhancement record"));
            assertTrue(activity.getDescription().contains("IMOCode:12345.0,VersionNumber:1.0"));
            assertNotNull(activity.getStartedDate());
            assertNotNull(activity.getEndDate());
            assertTrue(activity.getAssociatedAgents().contains(testAgent));
            return true;
        }));
    }

    @Test
    void testProcessAndDeleteShipData_VerifyRelationships() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        shipDataEnhancementService.processAndDeleteShipData(testId);

        // Assert - Verify relationships are established correctly
        verify(activityService).saveActivity(argThat(activity -> {
            // Check that agent is associated with activity
            return activity.getAssociatedAgents().contains(testAgent);
        }));

        verify(entityService).saveEntity(argThat(entity -> {
            // Check that entity has usedInActivities collection initialized
            return entity.getUsedInActivities() != null;
        }));
    }

    @Test
    void testProcessAndApproveShipData_VerifyRelationships() {
        // Arrange
        when(shipDataEnhancementRepository.findById(testId)).thenReturn(Optional.of(testShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        shipDataEnhancementService.processAndApproveShipData(testId);

        // Assert - Verify relationships are established correctly
        verify(activityService).saveActivity(argThat(activity -> {
            // Check that agent is associated with activity
            return activity.getAssociatedAgents().contains(testAgent);
        }));

        verify(entityService).saveEntity(argThat(entity -> {
            // Check that entity has usedInActivities collection initialized
            return entity.getUsedInActivities() != null;
        }));
    }

    @Test
    void testProcessAndDeleteShipData_WithDifferentIdTypes() {
        // Test with different ID combinations
        ShipDataEnhancementId alternativeId = new ShipDataEnhancementId(98765.0, "2.1");
        ShipDataEnhancement alternativeShipData = new ShipDataEnhancement();
        alternativeShipData.setId(alternativeId);
        alternativeShipData.setShipName("Alternative Ship");

        // Arrange
        when(shipDataEnhancementRepository.findById(alternativeId)).thenReturn(Optional.of(alternativeShipData));
        when(agentService.getAgentById(2)).thenReturn(testAgent);
        when(entityService.saveEntity(any(Entity_.class))).thenReturn(new Entity_());
        when(activityService.saveActivity(any(Activity.class))).thenReturn(new Activity());

        // Act
        assertDoesNotThrow(() -> shipDataEnhancementService.processAndDeleteShipData(alternativeId));

        // Assert
        verify(entityService).saveEntity(argThat(entity -> {
            assertTrue(entity.getDescription().contains("IMOCode:98765.0,VersionNumber:2.1"));
            return true;
        }));
    }

    @Test
    void testGetPaginatedShipData_EmptyResult() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Page<ShipDataEnhancement> emptyPage = new PageImpl<>(new ArrayList<>());
        
        when(shipDataEnhancementRepository.findAll(pageable)).thenReturn(emptyPage);

        // Act
        Page<ShipDataEnhancement> result = shipDataEnhancementService.getPaginatedShipData(pageable);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getContent().size());
        verify(shipDataEnhancementRepository).findAll(pageable);
    }
}