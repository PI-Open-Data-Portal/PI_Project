package opendata.portal.api.service;

import opendata.portal.api.model.Entity_;
import opendata.portal.api.repository.Entity_Repository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Entity_Service {

    @Autowired
    private Entity_Repository entity_Repository;

    public List<Entity_> getAllEntities() {
        return entity_Repository.findAll();
    }

    public Page<Entity_> getAllEntities(Pageable pageable) {
        return entity_Repository.findAll(pageable);
    }

    public Entity_ getEntityById(int id) {
        return entity_Repository.findById(id).orElse(null);
    }

    public Entity_ saveEntity(Entity_ entity) {
        return entity_Repository.save(entity);
    }

    public void deleteEntity(int id) {
        entity_Repository.deleteById(id);
    }
}
