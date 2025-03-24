package opendata.portal.api.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import opendata.portal.api.service.ContainerDetailsService;
import opendata.portal.api.model.ContainerDetails;

@RestController
@RequestMapping("/apiV1/ContainerDetails")
@Tag(name = "ContainerDetails", description = "Information about containers")
public class ContainerDetailsController {

    @Autowired
    private ContainerDetailsService ContainerDetailsService;

    @Autowired
    private PagedResourcesAssembler<ContainerDetails> assembler;

    private static final Logger log = LoggerFactory.getLogger(ContainerDetailsController.class);

    @Operation(summary = "Get all ContainerDetails with pages")
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<ContainerDetails>>> getContainerDetails(
            @PageableDefault(page = 0, size = 25, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Getting all ContainerDetails with pages");
        validateSortProperties(pageable.getSort());
        Page<ContainerDetails> ContainerDetails = ContainerDetailsService.getPaginatedContainerDetails(pageable);
        return ResponseEntity.ok(assembler.toModel(ContainerDetails));
    }

    @Operation(summary = "Get case study by code")
    @GetMapping("/{code}")
    public ResponseEntity<ContainerDetails> getContainerDetailsByCode(
            @Size(min = 4, max = 4, message = "Code must be exactly 4 characters") @Pattern(regexp = "^[a-zA-Z0-9]{4}$", message = "Code must be alphanumeric") String code) {
        log.info("Getting case study by code: " + code);

        ContainerDetails ContainerDetails = ContainerDetailsService.getContainerDetailsByCode(code);
        if (ContainerDetails == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(ContainerDetails);
        }
    }

    private void validateSortProperties(Sort sort) {
        Set<String> allowedProperties = Set.of(
                "id",
                "creation_date",
                "version_date",
                "version_number",
                "code",
                "description",
                "enabled",
                "height",
                "length",
                "payload",
                "reefer_container",
                "width",
                "harmonizedCode",
                "weight",
                "agency_id",
                "iso_size_id");
        for (Sort.Order order : sort) {
            if (!allowedProperties.contains(order.getProperty())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid sort property: " + order.getProperty() + ". Allowed properties: " + allowedProperties);
            }
        }
    }

}