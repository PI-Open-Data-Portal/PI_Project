package opendata.portal.api.controller;

import opendata.portal.api.model.ContainerDetails;
import opendata.portal.api.service.ContainerDetailsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.test.web.servlet.MockMvc;

import java.lang.reflect.Field;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContainerDetailsController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ContainerDetailsControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContainerDetailsService containerDetailsService;

    @MockBean
    private org.springframework.data.web.PagedResourcesAssembler<ContainerDetails> assembler;

    private ContainerDetails containerDetails;

    @BeforeEach
    void setUp() throws Exception {
        containerDetails = new ContainerDetails();
        Field idField = ContainerDetails.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(containerDetails, "ABCD");
        // outros campos se necessário
    }

    @Test
    void testGetAllContainerDetailsPaged() throws Exception {
        Page<ContainerDetails> page = new PageImpl<>(Collections.singletonList(containerDetails));
        PagedModel<EntityModel<ContainerDetails>> pagedModel = PagedModel.empty();
        given(containerDetailsService.getPaginatedContainerDetails(any(Pageable.class))).willReturn(page);
        given(assembler.toModel(page)).willReturn(pagedModel);
        mockMvc.perform(get("/apiV1/ContainerDetails"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetContainerDetailsByCodeNotFound() throws Exception {
        given(containerDetailsService.getContainerDetailsByCode("ZZZZ")).willReturn(null);
        mockMvc.perform(get("/apiV1/ContainerDetails/ZZZZ"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetContainerDetailsByCodeLowercase() throws Exception {
        mockMvc.perform(get("/apiV1/ContainerDetails/abcd"))
                .andExpect(status().isNotFound());
    }
}
