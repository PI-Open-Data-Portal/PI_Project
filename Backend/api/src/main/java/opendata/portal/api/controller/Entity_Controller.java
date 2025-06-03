package opendata.portal.api.controller;

import opendata.portal.api.model.Entity_;
import opendata.portal.api.service.Entity_Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apiV1/entities")
public class Entity_Controller {

    @Autowired
    private Entity_Service entity_Service;

    @GetMapping
    public ResponseEntity<List<Entity_>> getAllEntities() {
        return ResponseEntity.ok(entity_Service.getAllEntities());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Entity_>> getAllEntities(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(entity_Service.getAllEntities(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Entity_> getEntityById(@PathVariable int id) {
        Entity_ entity = entity_Service.getEntityById(id);
        return entity != null ? ResponseEntity.ok(entity) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Entity_> createEntity(@RequestBody Entity_ entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(entity_Service.saveEntity(entity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Entity_> updateEntity(@PathVariable int id, @RequestBody Entity_ entity) {
        Entity_ existingEntity = entity_Service.getEntityById(id);
        if (existingEntity == null) {
            return ResponseEntity.notFound().build();
        }
        entity.setId(id); // Ensure the ID is set for the update
        return ResponseEntity.ok(entity_Service.saveEntity(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntity(@PathVariable int id) {
        Entity_ existingEntity = entity_Service.getEntityById(id);
        if (existingEntity == null) {
            return ResponseEntity.notFound().build();
        }
        entity_Service.deleteEntity(id);
        return ResponseEntity.noContent().build();
    }
}
