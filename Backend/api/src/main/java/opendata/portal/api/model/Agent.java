package opendata.portal.api.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Agent")
@Getter
@Setter
public class Agent {

    @Id
    @Column(name = "id")
    private int id; // 123 id

    @Column(name = "description")
    private String description;

    @Column(name = "type")
    private String type;

    // Relationship: ManyToMany with Activity via 'WasAssociatedWith' table
    // 'activitiesAssociatedWithThisAgent' refers to activities this agent was
    // associated with
    @JsonBackReference("activity-associatedAgents")
    @ManyToMany(mappedBy = "associatedAgents")
    private Set<Activity> activitiesAssociatedWithThisAgent = new HashSet<>();
}
