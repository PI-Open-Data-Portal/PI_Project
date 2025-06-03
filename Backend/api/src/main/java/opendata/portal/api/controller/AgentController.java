package opendata.portal.api.controller;

import opendata.portal.api.model.Agent;
import opendata.portal.api.service.AgentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apiV1/agents")
public class AgentController {

    @Autowired
    private AgentService agentService;

    @GetMapping
    public ResponseEntity<List<Agent>> getAllAgents() {
        return ResponseEntity.ok(agentService.getAllAgents());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Agent>> getAllAgents(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(agentService.getAllAgents(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Agent> getAgentById(@PathVariable int id) {
        Agent agent = agentService.getAgentById(id);
        return agent != null ? ResponseEntity.ok(agent) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Agent> createAgent(@RequestBody Agent agent) {
        return ResponseEntity.status(HttpStatus.CREATED).body(agentService.saveAgent(agent));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Agent> updateAgent(@PathVariable int id, @RequestBody Agent agent) {
        Agent existingAgent = agentService.getAgentById(id);
        if (existingAgent == null) {
            return ResponseEntity.notFound().build();
        }
        agent.setId(id); // Ensure the ID is set for the update
        return ResponseEntity.ok(agentService.saveAgent(agent));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgent(@PathVariable int id) {
        Agent existingAgent = agentService.getAgentById(id);
        if (existingAgent == null) {
            return ResponseEntity.notFound().build();
        }
        agentService.deleteAgent(id);
        return ResponseEntity.noContent().build();
    }
}
