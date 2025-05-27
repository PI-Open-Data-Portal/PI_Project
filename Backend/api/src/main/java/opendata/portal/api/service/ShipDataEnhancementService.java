package opendata.portal.api.service;

import opendata.portal.api.model.ShipDataEnhancement;
import opendata.portal.api.repository.ShipDataEnhancementRepository;
import opendata.portal.api.model.Activity;
import opendata.portal.api.model.Agent;
import opendata.portal.api.model.Entity_;
import opendata.portal.api.model.ShipDataEnhancementId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityNotFoundException;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ShipDataEnhancementService {

    private final ShipDataEnhancementRepository shipDataEnhancementRepository;
    private final ActivityService activityService;
    private final AgentService agentService;
    private final Entity_Service entityService;

    @Autowired
    public ShipDataEnhancementService(
            ShipDataEnhancementRepository shipDataEnhancementRepository,
            ActivityService activityService,
            AgentService agentService,
            Entity_Service entityService) {
        this.shipDataEnhancementRepository = shipDataEnhancementRepository;
        this.activityService = activityService;
        this.agentService = agentService;
        this.entityService = entityService;
    }

    public Page<ShipDataEnhancement> getPaginatedShipData(Pageable pageable) {
        return shipDataEnhancementRepository.findAll(pageable);
    }

    @Transactional
    public void processAndDeleteShipData(ShipDataEnhancementId shipDataId) { // Changed parameter to
                                                                             // ShipDataEnhancementId
        // 1. Fetch the ShipDataEnhancement record
        ShipDataEnhancement shipData = shipDataEnhancementRepository.findById(shipDataId)
                .orElseThrow(() -> new EntityNotFoundException("ShipDataEnhancement not found with id: "
                        + shipDataId.getImoCode() + "-" + shipDataId.getVersionNumber()));

        // 2. Fetch the predefined Agent (ID 2)
        Agent agent = agentService.getAgentById(2); // Assuming agent ID 2 is fixed
        if (agent == null) {
            // Handle case where agent 2 is not found, perhaps throw a configuration error
            throw new EntityNotFoundException("Agent with ID 2 not found. Please ensure it exists.");
        }

        // 3. Create an Entity_ to represent the data being deleted
        Entity_ deletedDataRepresentation = new Entity_();
        String originalRecordIdentifier = "IMOCode:" + shipData.getId().getImoCode() + ",VersionNumber:"
                + shipData.getId().getVersionNumber();
        deletedDataRepresentation.setDescription(
                "Provenance record for deleted ShipDataEnhancement, original ID: " + originalRecordIdentifier);
        deletedDataRepresentation.setType("DeletedShipDataRecord");
        deletedDataRepresentation.setResourcePath("PRJ_LEI_2025.dbo.ShipDataEnhancement4"
                + originalRecordIdentifier.replace(",", "_").replace(":", "-"));
        deletedDataRepresentation.setCreationDate(LocalDateTime.now()); // Creation of this provenance entity
        // 'creatingActivity' for this Entity_ is null as it pre-existed this deletion
        // activity

        // 4. Create the Deletion Activity
        Activity deletionActivity = new Activity();
        deletionActivity.setId(UUID.randomUUID().toString()); // Activity ID is String
        deletionActivity.setDescription(
                "Deletion of ShipDataEnhancement record (original ID: " + originalRecordIdentifier + ")");
        deletionActivity.setType("DataDeletionOperation");
        deletionActivity.setStartedDate(LocalDateTime.now());
        deletionActivity.setEndDate(LocalDateTime.now());

        // 5. Establish relationships
        // Agent was associated with Activity
        deletionActivity.getAssociatedAgents().add(agent);
        // agent.getActivitiesAssociatedWithThisAgent().add(deletionActivity); //
        // Managed by owning side

        // Activity used Entity
        deletedDataRepresentation.getUsedInActivities().add(deletionActivity);
        // deletionActivity.getEntitiesUsingThisActivity().add(deletedDataRepresentation);
        // // Managed by owning side

        // 6. Save entities and relationships
        // Entity_ is the owner of the "Used" relationship (Activity-Entity_)
        entityService.saveEntity(deletedDataRepresentation);

        // Activity is the owner of the "WasAssociatedWith" relationship
        // (Activity-Agent)
        activityService.saveActivity(deletionActivity);

        // 7. Delete the original ShipDataEnhancement record
        shipDataEnhancementRepository.delete(shipData);
    }

    @Transactional
    public void processAndApproveShipData(ShipDataEnhancementId shipDataId) {
        // 1. Fetch the ShipDataEnhancement record
        ShipDataEnhancement shipData = shipDataEnhancementRepository.findById(shipDataId)
                .orElseThrow(() -> new EntityNotFoundException("ShipDataEnhancement not found with id: "
                        + shipDataId.getImoCode() + "-" + shipDataId.getVersionNumber()));

        // 2. Fetch the predefined Agent (ID 2)
        Agent agent = agentService.getAgentById(2); // Assuming agent ID 2 is fixed
        if (agent == null) {
            throw new EntityNotFoundException("Agent with ID 2 not found. Please ensure it exists.");
        }

        // 3. Create an Entity_ to represent the data being approved
        Entity_ approvedDataRepresentation = new Entity_();
        String originalRecordIdentifier = "IMOCode:" + shipData.getId().getImoCode() + ",VersionNumber:"
                + shipData.getId().getVersionNumber();
        approvedDataRepresentation.setDescription(
                "Provenance record for approved ShipDataEnhancement, original ID: " + originalRecordIdentifier);
        approvedDataRepresentation.setType("ApprovedShipDataRecord"); // Changed type
        // The resourcePath still refers to the original data's conceptual location
        approvedDataRepresentation.setResourcePath("ship_data_enhancement_table/original_id/"
                + originalRecordIdentifier.replace(",", "_").replace(":", "-"));
        approvedDataRepresentation.setCreationDate(LocalDateTime.now());

        // 4. Create the Approval Activity
        Activity approvalActivity = new Activity();
        approvalActivity.setId(UUID.randomUUID().toString());
        approvalActivity.setDescription(
                "Approval of ShipDataEnhancement record (original ID: " + originalRecordIdentifier + ")"); // Changed
                                                                                                           // description
        approvalActivity.setType("DataApprovalOperation"); // Changed type
        approvalActivity.setStartedDate(LocalDateTime.now());
        approvalActivity.setEndDate(LocalDateTime.now());

        // 5. Establish relationships
        approvalActivity.getAssociatedAgents().add(agent);
        approvedDataRepresentation.getUsedInActivities().add(approvalActivity);

        // 6. Save entities and relationships
        entityService.saveEntity(approvedDataRepresentation);
        activityService.saveActivity(approvalActivity);

        // 7. Delete the original ShipDataEnhancement record
        shipDataEnhancementRepository.delete(shipData);
    }
}