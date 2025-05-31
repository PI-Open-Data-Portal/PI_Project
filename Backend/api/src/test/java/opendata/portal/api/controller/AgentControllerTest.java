package opendata.portal.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import opendata.portal.api.model.Agent;
import opendata.portal.api.service.AgentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AgentController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
public class AgentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AgentService agentService;

    @Autowired
    private ObjectMapper objectMapper;

    private Agent agent;

    @BeforeEach
    void setUp() {
        agent = new Agent();
        agent.setId(1);
        agent.setDescription("Test Agent");
        agent.setType("Person");
    }

    @Test
    void testGetAllAgents() throws Exception {
        List<Agent> agents = Arrays.asList(agent);
        given(agentService.getAllAgents()).willReturn(agents);
        mockMvc.perform(get("/apiV1/agents"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(agent.getId()));
    }

    @Test
    void testGetAllAgentsPaged() throws Exception {
        Page<Agent> page = new PageImpl<>(Collections.singletonList(agent));
        given(agentService.getAllAgents(any(Pageable.class))).willReturn(page);
        mockMvc.perform(get("/apiV1/agents/paged"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(agent.getId()));
    }

    @Test
    void testGetAgentByIdFound() throws Exception {
        given(agentService.getAgentById(1)).willReturn(agent);
        mockMvc.perform(get("/apiV1/agents/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(agent.getId()));
    }

    @Test
    void testGetAgentByIdNotFound() throws Exception {
        given(agentService.getAgentById(2)).willReturn(null);
        mockMvc.perform(get("/apiV1/agents/2"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteAgentFound() throws Exception {
        given(agentService.getAgentById(1)).willReturn(agent);
        doNothing().when(agentService).deleteAgent(1);
        mockMvc.perform(delete("/apiV1/agents/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteAgentNotFound() throws Exception {
        given(agentService.getAgentById(2)).willReturn(null);
        mockMvc.perform(delete("/apiV1/agents/2"))
                .andExpect(status().isNotFound());
    }
}
