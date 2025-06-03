package opendata.portal.api.controller;

import opendata.portal.api.model.ShipDataEnhancement;
import opendata.portal.api.model.ShipDataEnhancementId;
import opendata.portal.api.service.ShipDataEnhancementService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import java.util.Collections;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ShipDataEnhancementController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ShipDataControlerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private ShipDataEnhancementService shipDataEnhancementService;
    @MockBean
    private PagedResourcesAssembler<ShipDataEnhancement> pagedResourcesAssembler;
    @Autowired
    private ObjectMapper objectMapper;

    private ShipDataEnhancementId validId;

    @BeforeEach
    void setUp() {
        validId = new ShipDataEnhancementId();
        validId.setImoCode(1234567.0);
        validId.setVersionNumber("1.0");
    }

    @Test
    void testGetShipData() throws Exception {
        Page<ShipDataEnhancement> page = new PageImpl<>(Collections.emptyList(), PageRequest.of(0, 10), 0);
        when(shipDataEnhancementService.getPaginatedShipData(any())).thenReturn(page);
        when(pagedResourcesAssembler.toModel(page)).thenReturn(PagedModel.empty());
        mockMvc.perform(get("/api/shipdata"))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteShipData_Success() throws Exception {
        doNothing().when(shipDataEnhancementService).processAndDeleteShipData(any());
        mockMvc.perform(post("/api/shipdata/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validId)))
                .andExpect(status().isOk());
    }

    @Test
    void testDeleteShipData_NotFound() throws Exception {
        doThrow(new EntityNotFoundException()).when(shipDataEnhancementService).processAndDeleteShipData(any());
        mockMvc.perform(post("/api/shipdata/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validId)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteShipData_BadRequest() throws Exception {
        // Envia corpo inválido (null)
        mockMvc.perform(post("/api/shipdata/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteShipData_InternalError() throws Exception {
        doThrow(new RuntimeException()).when(shipDataEnhancementService).processAndDeleteShipData(any());
        mockMvc.perform(post("/api/shipdata/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validId)))
                .andExpect(status().isInternalServerError());
    }

    @Test
    void testApproveShipData_Success() throws Exception {
        doNothing().when(shipDataEnhancementService).processAndApproveShipData(any());
        mockMvc.perform(post("/api/shipdata/approve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validId)))
                .andExpect(status().isOk());
    }

    @Test
    void testApproveShipData_NotFound() throws Exception {
        doThrow(new EntityNotFoundException()).when(shipDataEnhancementService).processAndApproveShipData(any());
        mockMvc.perform(post("/api/shipdata/approve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validId)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testApproveShipData_BadRequest() throws Exception {
        mockMvc.perform(post("/api/shipdata/approve")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testApproveShipData_InternalError() throws Exception {
        doThrow(new RuntimeException()).when(shipDataEnhancementService).processAndApproveShipData(any());
        mockMvc.perform(post("/api/shipdata/approve")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(validId)))
                .andExpect(status().isInternalServerError());
    }
}
