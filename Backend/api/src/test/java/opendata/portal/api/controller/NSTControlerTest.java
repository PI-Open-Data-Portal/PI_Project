package opendata.portal.api.controller;

import opendata.portal.api.model.NST2007_8PTABLE;
import opendata.portal.api.model.NST2007_3PTABLE;
import opendata.portal.api.service.NST2007_8PService;
import opendata.portal.api.service.NST2007_3PService;
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

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(NSTController.class)
@AutoConfigureMockMvc(addFilters = false)
public class NSTControlerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private NST2007_8PService nst2007_8PService;
    @MockBean
    private NST2007_3PService nst2007_3PService;
    @MockBean
    private PagedResourcesAssembler<NST2007_8PTABLE> assembler8P;
    @MockBean
    private PagedResourcesAssembler<NST2007_3PTABLE> assembler3P;

    private NST2007_8PTABLE nst8p;
    private NST2007_3PTABLE nst3p;

    @BeforeEach
    void setUp() {
        nst8p = new NST2007_8PTABLE();
        // Pode usar reflection ou construtor se necessário para setar campos
        nst3p = new NST2007_3PTABLE();
    }

    @Test
    void testGetNST2007_8P() throws Exception {
        Page<NST2007_8PTABLE> page = new PageImpl<>(Collections.singletonList(nst8p));
        when(nst2007_8PService.getPaginatedNST2007_8P(any())).thenReturn(page);
        when(assembler8P.toModel(page)).thenReturn(PagedModel.empty());
        mockMvc.perform(get("/apiV1/nst/nst2007_8p"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetNST2007_8PByIdFound() throws Exception {
        when(nst2007_8PService.getNST2007_8PById("1")).thenReturn(nst8p);
        mockMvc.perform(get("/apiV1/nst/nst2007_8p/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetNST2007_8PByIdNotFound() throws Exception {
        when(nst2007_8PService.getNST2007_8PById("2")).thenReturn(null);
        mockMvc.perform(get("/apiV1/nst/nst2007_8p/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testGetNST2007_3P() throws Exception {
        Page<NST2007_3PTABLE> page = new PageImpl<>(Collections.singletonList(nst3p));
        when(nst2007_3PService.getPaginatedNST2007_3P(any())).thenReturn(page);
        when(assembler3P.toModel(page)).thenReturn(PagedModel.empty());
        mockMvc.perform(get("/apiV1/nst/nst2007_3p"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetNST2007_3PByIdFound() throws Exception {
        when(nst2007_3PService.getNST2007_3PById("1")).thenReturn(nst3p);
        mockMvc.perform(get("/apiV1/nst/nst2007_3p/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetNST2007_3PByIdNotFound() throws Exception {
        when(nst2007_3PService.getNST2007_3PById("2")).thenReturn(null);
        mockMvc.perform(get("/apiV1/nst/nst2007_3p/2"))
                .andExpect(status().isNotFound());
    }
}
