package opendata.portal.api.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import opendata.portal.api.service.CaseStudyService;
import opendata.portal.api.dto.NST2007_2PStatDTO;
import opendata.portal.api.dto.OutlierDTO;
import opendata.portal.api.dto.Prov2PrefixStatDTO;
import opendata.portal.api.dto.WeightStatisticsDTO;
import opendata.portal.api.model.CaseStudy;
import opendata.portal.api.dto.DisembarkationPortStatDTO;
import opendata.portal.api.dto.PortPairStatDTO;

@RestController
@RequestMapping("/apiV1/casestudy")
@CrossOrigin(origins = "http://localhost:3000")
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
            @PageableDefault(page = 0, size = 25, sort = "id", direction = Sort.Direction.ASC) Pageable pageable,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean isTranshipment,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String embarkationLocations,
            @RequestParam(required = false) String disembarkationLocations,
            @RequestParam(required = false) @Pattern(regexp = "^(T|ML|C)$", message = "Type must be T, ML, or C") String type) {
        log.info("Getting all case studies with pages");
        // validateSortProperties(pageable.getSort());
        Page<CaseStudy> caseStudies = caseStudyService.getPaginatedCaseStudies(pageable, startDate, endDate,
                isTranshipment, message,
                embarkationLocations, disembarkationLocations, type);
        return ResponseEntity.ok(assembler.toModel(caseStudies));
    }

    @Operation(summary = "Get case study by id")
    @GetMapping("/{id}")
    @CrossOrigin(origins = "http://localhost:3000")
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
    @Deprecated
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

    @GetMapping("/2p-products")
    public ResponseEntity<List<NST2007_2PStatDTO>> getNST2007_2PProductStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean isTranshipment,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String embarkationLocations,
            @RequestParam(required = false) String disembarkationLocations) {
        return ResponseEntity.ok(
                caseStudyService.getNST2007_2PProductStats(startDate, endDate, isTranshipment, message,
                        embarkationLocations, disembarkationLocations));
    }

    @GetMapping("/prov2-prefix")
    public ResponseEntity<List<Prov2PrefixStatDTO>> getProv2PrefixStats(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean isTransshipment,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String embarkationLocations,
            @RequestParam(required = false) String disembarkationLocations) {
        return ResponseEntity
                .ok(caseStudyService.getProv2PrefixStats(startDate, endDate, isTransshipment, message,
                        embarkationLocations, disembarkationLocations));
    }

    @GetMapping("/weight-statistics")
    public ResponseEntity<WeightStatisticsDTO> getWeightStatistics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean isTransshipment,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String embarkationLocations,
            @RequestParam(required = false) String disembarkationLocations) {
        return ResponseEntity
                .ok(caseStudyService.getWeightStatistics(startDate, endDate, isTransshipment, message,
                        embarkationLocations, disembarkationLocations));
    }

    @Deprecated
    @GetMapping("/embarkation-ports")
    public ResponseEntity<List<DisembarkationPortStatDTO>> getEmbarkationPortFrequency() {
        return ResponseEntity.ok(
                caseStudyService.getEmbarkationPortFrequency());
    }

    @GetMapping("/v2/port-pairs")
    public ResponseEntity<List<PortPairStatDTO>> getPortPairFrequency(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean isTranshipment,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String embarkationLocations,
            @RequestParam(required = false) String disembarkationLocations) {
        return ResponseEntity.ok(
                caseStudyService.getPortPairFrequency(startDate, endDate, isTranshipment, message,
                        embarkationLocations, disembarkationLocations));
    }

    @GetMapping("/download")
    public ResponseEntity<?> downloadCaseStudies(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Boolean isTranshipment,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String embarkationLocations,
            @RequestParam(required = false) String disembarkationLocations,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) List<String> columns,
            @RequestParam(defaultValue = "json") String format) {

        log.info("Downloading case studies in format: {}", format);

        try {
            // Validate format parameter
            String formatLower = format.toLowerCase();
            if (!formatLower.equals("csv") && !formatLower.equals("json") && !formatLower.equals("parquet")) {
                return ResponseEntity.badRequest().body("Invalid format. Supported formats: json, csv, parquet");
            }

            // Get byte data from service
            byte[] fileContent = caseStudyService.downloadCaseStudies(
                    startDate, endDate, isTranshipment, message,
                    embarkationLocations, disembarkationLocations, type,
                    columns, formatLower);

            // Determine content type and file extension
            String contentType;
            String fileExtension;

            switch (formatLower) {
                case "csv":
                    contentType = "text/csv";
                    fileExtension = "csv";
                    break;
                case "parquet":
                    contentType = "application/octet-stream";
                    fileExtension = "parquet";
                    break;
                case "json":
                default:
                    contentType = "application/json";
                    fileExtension = "json";
                    break;
            }

            log.info("Successfully prepared {} file with {} bytes", fileExtension, fileContent.length);

            // Return the file as a downloadable response
            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=case_studies." + fileExtension)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(fileContent);

        } catch (IllegalArgumentException e) {
            log.warn("Bad request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            log.error("Error while downloading case studies", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error while processing the request: " + e.getMessage());
        }
    }

    @GetMapping("/outliers")
    public ResponseEntity<List<OutlierDTO>> getOutliers() {
        List<OutlierDTO> outliers = caseStudyService.getOutliers();
        return ResponseEntity.ok(outliers);
    }
}