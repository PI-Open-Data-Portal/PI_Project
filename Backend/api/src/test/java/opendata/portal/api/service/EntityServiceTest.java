package opendata.portal.api.service;

import opendata.portal.api.model.Entity_;
import opendata.portal.api.repository.Entity_Repository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EntityServiceTest {
    @Mock
    private Entity_Repository entityRepository;

    @InjectMocks
    private Entity_Service entityService;

    private Entity_ entity;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        entity = new Entity_();
        entity.setId(1);
        entity.setDescription("desc");
        entity.setType("type");
    }

    @Test
    void testGetAllEntities() {
        when(entityRepository.findAll()).thenReturn(Collections.singletonList(entity));
        List<Entity_> result = entityService.getAllEntities();
        assertEquals(1, result.size());
    }

    @Test
    void testGetAllEntitiesPageable() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Entity_> page = new PageImpl<>(Collections.singletonList(entity));
        when(entityRepository.findAll(pageable)).thenReturn(page);
        Page<Entity_> result = entityService.getAllEntities(pageable);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetEntityByIdFound() {
        when(entityRepository.findById(1)).thenReturn(Optional.of(entity));
        Entity_ result = entityService.getEntityById(1);
        assertNotNull(result);
    }

    @Test
    void testGetEntityByIdNotFound() {
        when(entityRepository.findById(2)).thenReturn(Optional.empty());
        Entity_ result = entityService.getEntityById(2);
        assertNull(result);
    }

    @Test
    void testSaveEntity() {
        when(entityRepository.save(entity)).thenReturn(entity);
        Entity_ result = entityService.saveEntity(entity);
        assertEquals(1, result.getId());
    }

    @Test
    void testDeleteEntity() {
        doNothing().when(entityRepository).deleteById(1);
        entityService.deleteEntity(1);
        verify(entityRepository, times(1)).deleteById(1);
    }
}
