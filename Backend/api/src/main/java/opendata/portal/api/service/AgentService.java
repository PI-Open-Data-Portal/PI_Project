package opendata.portal.api.service;

import opendata.portal.api.model.Agent;
import opendata.portal.api.repository.AgentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AgentService {

    @Autowired
    private AgentRepository agentRepository;

    public List<Agent> getAllAgents() {
        return agentRepository.findAll();
    }

    public Page<Agent> getAllAgents(Pageable pageable) {
        return agentRepository.findAll(pageable);
    }

    public Agent getAgentById(int id) {
        return agentRepository.findById(id).orElse(null);
    }

    public Agent saveAgent(Agent agent) {
        return agentRepository.save(agent);
    }

    public void deleteAgent(int id) {
        agentRepository.deleteById(id);
    }
}
