package opendata.portal.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "NST2007_8PTABLE")
@Getter
public class NST2007_8PTABLE {
    @Id
    @Column(name = "NST2007_8p")
    private String id;

    @Column(name = "NST2007_8P_Label_EN")
    private String labelEN;

    @Column(name = "NST2007_8P_Label_PT")
    private String labelPT;

    @ManyToOne
    @JoinColumn(name = "NST2007_3p")
    private NST2007_3PTABLE nst2007_3p;

}
