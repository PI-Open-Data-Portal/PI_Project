package opendata.portal.api.controller;

import opendata.portal.api.model.ShipDataEnhancement;
import opendata.portal.api.service.ShipDataEnhancementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;

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
}