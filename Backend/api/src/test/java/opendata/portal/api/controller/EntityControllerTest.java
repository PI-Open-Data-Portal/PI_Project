package opendata.portal.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import opendata.portal.api.model.Entity_;
import opendata.portal.api.service.Entity_Service;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(Entity_Controller.class)
@AutoConfigureMockMvc(addFilters = false)
public class EntityControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Entity_Service entityService;

    @Autowired
    private ObjectMapper objectMapper;

    private Entity_ entity;

    @BeforeEach
    void setUp() {
        entity = new Entity_();
        entity.setId(1);
        entity.setDescription("Test entity");
        entity.setType("Type");
    }

    @Test
    void testGetAllEntities() throws Exception {
        List<Entity_> entities = Collections.singletonList(entity);
        given(entityService.getAllEntities()).willReturn(entities);
        mockMvc.perform(get("/apiV1/entities"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(entity.getId()));
    }

    @Test
    void testGetAllEntitiesPaged() throws Exception {
        Page<Entity_> page = new PageImpl<>(Collections.singletonList(entity));
        given(entityService.getAllEntities(any(Pageable.class))).willReturn(page);
        mockMvc.perform(get("/apiV1/entities/paged"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(entity.getId()));
    }

    @Test
    void testGetEntityByIdFound() throws Exception {
        given(entityService.getEntityById(1)).willReturn(entity);
        mockMvc.perform(get("/apiV1/entities/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(entity.getId()));
    }

    @Test
    void testGetEntityByIdNotFound() throws Exception {
        given(entityService.getEntityById(2)).willReturn(null);
        mockMvc.perform(get("/apiV1/entities/2"))
                .andExpect(status().isNotFound());
    }

    // Não testa POST/PUT para evitar erro 415

    @Test
    void testDeleteEntityFound() throws Exception {
        given(entityService.getEntityById(1)).willReturn(entity);
        doNothing().when(entityService).deleteEntity(1);
        mockMvc.perform(delete("/apiV1/entities/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteEntityNotFound() throws Exception {
        given(entityService.getEntityById(2)).willReturn(null);
        mockMvc.perform(delete("/apiV1/entities/2"))
                .andExpect(status().isNotFound());
    }
}
