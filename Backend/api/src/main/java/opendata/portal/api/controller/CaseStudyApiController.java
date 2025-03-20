package opendata.portal.api.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import opendata.portal.api.service.CaseStudyService;
import opendata.portal.api.model.CaseStudy;

@RestController
@RequestMapping("/apiV1/casestudy")
@Tag(name = "Case Study", description = "The Case Study API with prov")
public class CaseStudyApiController {

    @Autowired
    private CaseStudyService caseStudyService;

    @Autowired
    private PagedResourcesAssembler<CaseStudy> assembler;

    private static final Logger log = LoggerFactory.getLogger(CaseStudyApiController.class);

    @Operation(summary = "Get all case studies with pages")
    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<CaseStudy>>> getCaseStudies(
            @PageableDefault(page = 0, size = 25, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Getting all case studies with pages");
        validateSortProperties(pageable.getSort());
        Page<CaseStudy> caseStudies = caseStudyService.getPaginatedCaseStudies(pageable);
        return ResponseEntity.ok(assembler.toModel(caseStudies));
    }

    @Operation(summary = "Get case study by id")
    @GetMapping("/{id}")
    public ResponseEntity<CaseStudy> getCaseStudyById(
            @PathVariable @Min(value = 0, message = "id must be positive") int id) {
        log.info("Getting case study by id: " + id);

        CaseStudy caseStudy = caseStudyService.getCaseStudyById(id);
        if (caseStudy == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(caseStudy);
        }
    }

    @Operation(summary = "Get case study by prov (T, ML, C)")
    @GetMapping("/prov/{type}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<PagedModel<EntityModel<CaseStudy>>> getMethodName(
            @PathVariable @Pattern(regexp = "^(T|ML|C)$", message = "Type must be T, ML, or C") String type,
            @PageableDefault(page = 0, size = 25, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Getting case study by prov");
        validateSortProperties(pageable.getSort());
        Page<CaseStudy> caseStudies = caseStudyService.getCasesStudyByProv2(pageable, type);
        return ResponseEntity.ok(assembler.toModel(caseStudies));
    }

    private void validateSortProperties(Sort sort) {
        Set<String> allowedProperties = Set.of(
                "id",
                "containerPlate",
                "cargoDescription",
                "message",
                "movementDate",
                "embarkationPort",
                "disembarkationPort",
                "transhipment",
                "isoContentainer",
                "isoContentainerRegistry",
                "containerTare",
                "containerState",
                "harmonizedCode",
                "weight",
                "brokenPackagesQuantity",
                "packagesQuantity",
                "departureWeight",
                "cn20078PLabelEN",
                "nst20073P",
                "nst20073PLabelEN",
                "nst20072P",
                "nst20072PLabelEN",
                "prov",
                "prov2");
        for (Sort.Order order : sort) {
            if (!allowedProperties.contains(order.getProperty())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid sort property: " + order.getProperty() + ". Allowed properties: " + allowedProperties);
            }
        }
    }
}