package opendata.portal.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "NST2007_2PTABLE")
@Getter

public class NST2007_2PTABLE {
    @Id
    @Column(name = "NST2007_2p")
    private String id;

    @Column(name = "NST2007_2P_Label_EN")
    private String labelEN;

    @Column(name = "NST2007_2P_Label_PT")
    private String labelPT;

}
