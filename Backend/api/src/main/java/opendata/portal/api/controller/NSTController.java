package opendata.portal.api.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import opendata.portal.api.service.NST2007_8PService;
import opendata.portal.api.service.NST2007_3PService;
import opendata.portal.api.model.NST2007_8PTABLE;
import opendata.portal.api.model.NST2007_3PTABLE;

@RestController
@RequestMapping("/apiV1/nst")
@Deprecated
@Tag(name = "NST", description = "The NST API")
public class NSTController {

    @Autowired
    private NST2007_8PService nst2007_8PService;

    @Autowired
    private NST2007_3PService nst2007_3PService;

    @Autowired
    private PagedResourcesAssembler<NST2007_8PTABLE> assembler8P;

    @Autowired
    private PagedResourcesAssembler<NST2007_3PTABLE> assembler3P;

    private static final Logger log = LoggerFactory.getLogger(NSTController.class);

    @Operation(summary = "Get all NST2007_8P with pages")
    @GetMapping("/nst2007_8p")
    public ResponseEntity<PagedModel<EntityModel<NST2007_8PTABLE>>> getNST2007_8P(
            @PageableDefault(page = 0, size = 25, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Getting all NST2007_8P with pages");
        validateSortProperties(pageable.getSort(), Set.of("id", "labelEN", "labelPT"));
        Page<NST2007_8PTABLE> nst2007_8P = nst2007_8PService.getPaginatedNST2007_8P(pageable);

        return ResponseEntity.ok(assembler8P.toModel(nst2007_8P));
    }

    @Operation(summary = "Get NST2007_8P by id")
    @GetMapping("/nst2007_8p/{id}")
    public ResponseEntity<NST2007_8PTABLE> getNST2007_8PById(
            @PathVariable @Min(value = 0, message = "id must be positive") String id) {
        log.info("Getting NST2007_8P by id: " + id);

        NST2007_8PTABLE nst2007_8P = nst2007_8PService.getNST2007_8PById(id);
        if (nst2007_8P == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(nst2007_8P);
        }
    }

    @Operation(summary = "Get all NST2007_3P with pages")
    @GetMapping("/nst2007_3p")
    public ResponseEntity<PagedModel<EntityModel<NST2007_3PTABLE>>> getNST2007_3P(
            @PageableDefault(page = 0, size = 25, sort = "id", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Getting all NST2007_3P with pages");
        validateSortProperties(pageable.getSort(), Set.of("id", "labelEN", "labelPT"));
        Page<NST2007_3PTABLE> nst2007_3P = nst2007_3PService.getPaginatedNST2007_3P(pageable);
        return ResponseEntity.ok(assembler3P.toModel(nst2007_3P));
    }

    @Operation(summary = "Get NST2007_3P by id")
    @GetMapping("/nst2007_3p/{id}")
    public ResponseEntity<NST2007_3PTABLE> getNST2007_3PById(
            @PathVariable @Min(value = 0, message = "id must be positive") String id) {
        log.info("Getting NST2007_3P by id: " + id);

        NST2007_3PTABLE nst2007_3P = nst2007_3PService.getNST2007_3PById(id);
        if (nst2007_3P == null) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(nst2007_3P);
        }
    }

    private void validateSortProperties(Sort sort, Set<String> allowedProperties) {
        for (Sort.Order order : sort) {
            if (!allowedProperties.contains(order.getProperty())) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid sort property: " + order.getProperty() + ". Allowed properties: " + allowedProperties);
            }
        }
    }
}