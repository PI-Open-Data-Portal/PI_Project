package opendata.portal.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Table(name = "case_study")
@Getter
public class CaseStudy {

    @Id
    @Column(name = "ID")
    private int id;

    @Column(name = "Container_Plate")
    private String containerPlate;

    @Column(name = "Cargo_Description")
    private String cargoDescription;

    @Column(name = "Message")
    private String message;

    @Column(name = "Movement_Date")
    private String movementDate;

    @Column(name = "Embarkation_Port")
    private String embarkationPort;

    @Column(name = "Disembarkation_Port")
    private String disembarkationPort;

    @Column(name = "Transhipment")
    private String transhipment;

    @Column(name = "ISO_contentainer")
    private String isoContentainer;

    @Column(name = "ISO_contentainer_Registry")
    private String isoContentainerRegistry;

    @Column(name = "Container_Tare")
    private int containerTare;

    @Column(name = "Container_State")
    private String containerState;

    @Column(name = "Harmonized_Code")
    private String harmonizedCode;

    @Column(name = "Weight")
    private float weight;

    @Column(name = "Broken_Packages_Quantity")
    private int brokenPackagesQuantity;

    @Column(name = "Packages_Quantity")
    private float packagesQuantity;

    @Column(name = "Departure_Weight")
    private float departureWeight;

    @Column(name = "CN2007_8P_Label_EN")
    private String cn20078PLabelEN;

    @Column(name = "NST2007_3P")
    private String nst20073P;

    @Column(name = "NST2007_3P_Label_EN")
    private String nst20073PLabelEN;

    @Column(name = "NST2007_2P")
    private String nst20072P;

    @Column(name = "NST2007_2P_Label_EN")
    private String nst20072PLabelEN;

    @Column(name = "prov")
    private String prov;

    @Column(name = "prov2")
    private String prov2;

}
