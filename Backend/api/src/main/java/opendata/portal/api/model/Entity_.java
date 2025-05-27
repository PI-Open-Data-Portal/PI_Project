package opendata.portal.api.model;

import jakarta.persistence.*;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "Entity")
@Getter
@Setter
public class Entity_ {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Add this line
    @Column(name = "id")
    private int id; // 123 id

    @Column(name = "description")
    private String description;

    @Column(name = "type")
    private String type;

    @Column(name = "resource_path")
    private String resourcePath;

    @Column(name = "creation_date")
    private LocalDateTime creationDate;

    @Column(name = "command_text")
    private String commandText;

    // Relationship: ManyToOne with Activity (this Entity was created by an
    // Activity)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_activity") // This is the foreign key in Entity table
    private Activity creatingActivity;

    // Relationship: ManyToMany with Activity via 'Used' table
    // 'usedInActivities' refers to activities where this entity was used
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "Used", joinColumns = @JoinColumn(name = "id_entity"), inverseJoinColumns = @JoinColumn(name = "id_activity"))
    private Set<Activity> usedInActivities = new HashSet<>();

    // Relationship: ManyToMany with other Entities via 'WasDerivedFrom' table
    // 'derivedFromEntities' refers to entities from which this entity was derived
    @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    @JoinTable(name = "WasDerivedFrom", joinColumns = @JoinColumn(name = "id_entity"), // Entity that was derived
            inverseJoinColumns = @JoinColumn(name = "id_prov")) // Entity it was derived from
    private Set<Entity_> derivedFromEntities = new HashSet<>();

    // Relationship: ManyToMany with other Entities via 'WasDerivedFrom' table
    // (inverse side)
    // 'derivedToEntities' refers to entities that were derived from this entity
    @ManyToMany(mappedBy = "derivedFromEntities")
    private Set<Entity_> derivedToEntities = new HashSet<>();
}
