package opendata.portal.api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Activity")
@Getter
@Setter
public class Activity {

    @Id
    @Column(name = "id")
    private String id; // A-Z id

    @Column(name = "description")
    private String description;

    @Column(name = "type")
    private String type;

    @Column(name = "started_date")
    private LocalDateTime startedDate;

    @Column(name = "end_date")
    private LocalDateTime endDate;

    // Relationship: An Activity can be the 'creatingActivity' for multiple Entities
    @OneToMany(mappedBy = "creatingActivity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Entity_> createdEntities = new HashSet<>();

    // Relationship: ManyToMany with Entity via 'Used' table
    // 'entitiesUsingThisActivity' refers to entities that "used" this activity
    @ManyToMany(mappedBy = "usedInActivities")
    private Set<Entity_> entitiesUsingThisActivity = new HashSet<>();

    // Relationship: ManyToMany with Agent via 'WasAssociatedWith' table
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "WasAssociatedWith", joinColumns = @JoinColumn(name = "id_activity"), inverseJoinColumns = @JoinColumn(name = "id_agent"))
    private Set<Agent> associatedAgents = new HashSet<>();
}
