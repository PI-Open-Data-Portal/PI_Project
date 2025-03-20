package opendata.portal.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import java.util.Date;

@Entity
@Table(name = "E_julmd_container_type")
@Getter
public class ContainerDetails {
    @Id
    @Column(name = "ID")
    private String id;

    @Column(name = "creation_date")
    private Date creationDate;

    @Column(name = "version_date")
    private Date versionDate;

    @Column(name = "version_number")
    private Integer versionNumber;

    @Column(name = "code")
    private String code;

    @Column(name = "description")
    private Boolean description;

    @Column(name = "enabled")
    private Integer enabled;

    @Column(name = "payload", nullable = true)
    private Integer payload;

    @Column(name = "height", nullable = true)
    private Integer height;

    @Column(name = "length", nullable = true)
    private Integer length;

    @Column(name = "reefer_container", nullable = true)
    private Boolean reeferContainer;

    @Column(name = "width")
    private Integer width;

    @Column(name = "agency_id")
    private String agencyId;

    @Column(name = "iso_size_id")
    private String isoSizeId;
}