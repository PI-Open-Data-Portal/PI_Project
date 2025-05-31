package opendata.portal.api.controller;

import opendata.portal.api.model.ShipDataEnhancement;
import opendata.portal.api.model.ShipDataEnhancementId;
import opendata.portal.api.service.ShipDataEnhancementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/shipdata")
public class ShipDataEnhancementController {

    private final ShipDataEnhancementService shipDataEnhancementService;
    private final PagedResourcesAssembler<ShipDataEnhancement> pagedResourcesAssembler;

    @Autowired
    public ShipDataEnhancementController(ShipDataEnhancementService shipDataEnhancementService,
            PagedResourcesAssembler<ShipDataEnhancement> pagedResourcesAssembler) {
        this.shipDataEnhancementService = shipDataEnhancementService;
        this.pagedResourcesAssembler = pagedResourcesAssembler;
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<ShipDataEnhancement>>> getShipData(Pageable pageable) {
        Page<ShipDataEnhancement> shipDataPage = shipDataEnhancementService.getPaginatedShipData(pageable);
        PagedModel<EntityModel<ShipDataEnhancement>> pagedModel = pagedResourcesAssembler.toModel(shipDataPage);
        return ResponseEntity.ok(pagedModel);
    }

    @PostMapping("/delete")
    public ResponseEntity<Void> deleteShipDataAndLogProvenance(@RequestBody ShipDataEnhancementId shipDataIdToDelete) { // Changed
                                                                                                                        // parameter
                                                                                                                        // to
                                                                                                                        // ShipDataEnhancementId
        // We expect the ID (imoCode and versionNumber) to be present in the request
        // body
        if (shipDataIdToDelete == null || shipDataIdToDelete.getImoCode() == null
                || shipDataIdToDelete.getVersionNumber() == null) {
            return ResponseEntity.badRequest().build(); // Or throw a specific exception
        }
        try {
            shipDataEnhancementService.processAndDeleteShipData(shipDataIdToDelete);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Log the exception e.g., using a logger
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/approve") // New endpoint for approving
    public ResponseEntity<Void> approveShipDataAndLogProvenance(
            @RequestBody ShipDataEnhancementId shipDataIdToApprove) {
        if (shipDataIdToApprove == null || shipDataIdToApprove.getImoCode() == null
                || shipDataIdToApprove.getVersionNumber() == null) {
            return ResponseEntity.badRequest().build();
        }
        try {
            shipDataEnhancementService.processAndApproveShipData(shipDataIdToApprove);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            // Log the exception e.g., using a logger
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}