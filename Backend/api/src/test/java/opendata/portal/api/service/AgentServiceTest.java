package opendata.portal.api.service;

import opendata.portal.api.model.Agent;
import opendata.portal.api.repository.AgentRepository;
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

public class AgentServiceTest {
    @Mock
    private AgentRepository agentRepository;

    @InjectMocks
    private AgentService agentService;

    private Agent agent;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        agent = new Agent();
        agent.setId(1);
    }

    @Test
    void testGetAllAgents() {
        when(agentRepository.findAll()).thenReturn(Collections.singletonList(agent));
        List<Agent> result = agentService.getAllAgents();
        assertEquals(1, result.size());
    }

    @Test
    void testGetAllAgentsPageable() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Agent> page = new PageImpl<>(Collections.singletonList(agent));
        when(agentRepository.findAll(pageable)).thenReturn(page);
        Page<Agent> result = agentService.getAllAgents(pageable);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetAgentByIdFound() {
        when(agentRepository.findById(1)).thenReturn(Optional.of(agent));
        Agent result = agentService.getAgentById(1);
        assertNotNull(result);
    }

    @Test
    void testGetAgentByIdNotFound() {
        when(agentRepository.findById(2)).thenReturn(Optional.empty());
        Agent result = agentService.getAgentById(2);
        assertNull(result);
    }

    @Test
    void testSaveAgent() {
        when(agentRepository.save(agent)).thenReturn(agent);
        Agent result = agentService.saveAgent(agent);
        assertEquals(1, result.getId());
    }

    @Test
    void testDeleteAgent() {
        doNothing().when(agentRepository).deleteById(1);
        agentService.deleteAgent(1);
        verify(agentRepository, times(1)).deleteById(1);
    }
}
