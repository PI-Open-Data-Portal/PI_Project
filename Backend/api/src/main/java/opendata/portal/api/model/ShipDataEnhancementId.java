package opendata.portal.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode // Important for composite keys
public class ShipDataEnhancementId implements Serializable {

    private static final long serialVersionUID = 1L; // Good practice for Serializable classes

    @Column(name = "IMOCode") // Matches the column name in your ShipDataEnhancement4 table
    private Double imoCode;

    @Column(name = "versionNumber") // Matches the column name in your ShipDataEnhancement4 table
    private String versionNumber;
}