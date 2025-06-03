package opendata.portal.api.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ShipDataEnhancement4", schema = "dbo")
@Getter
@Setter
public class ShipDataEnhancement {

    @EmbeddedId
    private ShipDataEnhancementId id; // Composite ID

    @Column(name = "shipName")
    private String shipName;

    @Column(name = "shipType")
    private String shipType;

    // @Column(name = "IMOCode")
    // private Double imoCode;

    @Column(name = "breadthMoulded")
    private Double breadthMoulded;

    @Column(name = "deadweight")
    private Double deadweight;

    @Column(name = "gt")
    private Double gt;

    @Column(name = "lbp")
    private Double lbp;

    @Column(name = "loa")
    private Double loa;

    @Column(name = "nt")
    private Double nt;

    @Column(name = "sbt")
    private String sbt;

    @Column(name = "maximumDraught")
    private Double maximumDraught;

    @Column(name = "tonnage")
    private Double tonnage;

    @Column(name = "teuCapacity")
    private String teuCapacity;

    @Column(name = "constructionDate")
    private String constructionDate;

    @Column(name = "maxSpeed")
    private String maxSpeed;

    @Column(name = "versionDate")
    private String versionDate;

    // @Column(name = "versionNumber")
    // private Double versionNumber;

    // Campos de breadthMoulded
    @Column(name = "prev_breadthMoulded")
    private Double prevBreadthMoulded;

    @Column(name = "next_breadthMoulded")
    private Double nextBreadthMoulded;

    @Column(name = "breadthMoulded_changed", length = 10)
    private String breadthMouldedChanged;

    @Column(name = "breadthMoulded_suspicious", length = 10)
    private String breadthMouldedSuspicious;

    @Column(name = "breadthMoulded_outlier", length = 10)
    private String breadthMouldedOutlier;

    @Column(name = "breadthMoulded_reverted", length = 10)
    private String breadthMouldedReverted;

    // Campos de versão
    @Column(name = "version_datetime", length = 50)
    private String versionDatetime;

    @Column(name = "time_diff_hours")
    private Double timeDiffHours;

    // Campos de breadthMoulded (continuação)
    @Column(name = "breadthMoulded_rapid_change", length = 10)
    private String breadthMouldedRapidChange;

    @Column(name = "breadthMoulded_oscillating", length = 10)
    private String breadthMouldedOscillating;

    // Campos de deadweight
    @Column(name = "prev_deadweight")
    private Double prevDeadweight;

    @Column(name = "next_deadweight")
    private Double nextDeadweight;

    @Column(name = "deadweight_changed", length = 10)
    private String deadweightChanged;

    @Column(name = "deadweight_suspicious", length = 10)
    private String deadweightSuspicious;

    @Column(name = "deadweight_outlier", length = 10)
    private String deadweightOutlier;

    @Column(name = "deadweight_reverted", length = 10)
    private String deadweightReverted;

    @Column(name = "deadweight_rapid_change", length = 10)
    private String deadweightRapidChange;

    @Column(name = "deadweight_oscillating", length = 10)
    private String deadweightOscillating;

    // Campos de gt
    @Column(name = "prev_gt")
    private Double prevGt;

    @Column(name = "next_gt")
    private Double nextGt;

    @Column(name = "gt_changed", length = 10)
    private String gtChanged;

    @Column(name = "gt_suspicious", length = 10)
    private String gtSuspicious;

    @Column(name = "gt_outlier", length = 10)
    private String gtOutlier;

    @Column(name = "gt_reverted", length = 10)
    private String gtReverted;

    @Column(name = "gt_rapid_change", length = 10)
    private String gtRapidChange;

    @Column(name = "gt_oscillating", length = 10)
    private String gtOscillating;

    // Campos de lbp
    @Column(name = "prev_lbp")
    private Double prevLbp;

    @Column(name = "next_lbp")
    private Double nextLbp;

    @Column(name = "lbp_changed", length = 10)
    private String lbpChanged;

    @Column(name = "lbp_suspicious", length = 10)
    private String lbpSuspicious;

    @Column(name = "lbp_outlier", length = 10)
    private String lbpOutlier;

    @Column(name = "lbp_reverted", length = 10)
    private String lbpReverted;

    @Column(name = "lbp_rapid_change", length = 10)
    private String lbpRapidChange;

    @Column(name = "lbp_oscillating", length = 10)
    private String lbpOscillating;

    // Campos de loa
    @Column(name = "prev_loa")
    private Double prevLoa;

    @Column(name = "next_loa")
    private Double nextLoa;

    @Column(name = "loa_changed", length = 10)
    private String loaChanged;

    @Column(name = "loa_suspicious", length = 10)
    private String loaSuspicious;

    @Column(name = "loa_outlier", length = 10)
    private String loaOutlier;

    @Column(name = "loa_reverted", length = 10)
    private String loaReverted;

    @Column(name = "loa_rapid_change", length = 10)
    private String loaRapidChange;

    @Column(name = "loa_oscillating", length = 10)
    private String loaOscillating;

    // Campos de nt
    @Column(name = "prev_nt")
    private Double prevNt;

    @Column(name = "next_nt")
    private Double nextNt;

    @Column(name = "nt_changed", length = 10)
    private String ntChanged;

    @Column(name = "nt_suspicious", length = 10)
    private String ntSuspicious;

    @Column(name = "nt_outlier", length = 10)
    private String ntOutlier;

    @Column(name = "nt_reverted", length = 10)
    private String ntReverted;

    @Column(name = "nt_rapid_change", length = 10)
    private String ntRapidChange;

    @Column(name = "nt_oscillating", length = 10)
    private String ntOscillating;

    // Campos de maximumDraught
    @Column(name = "prev_maximumDraught")
    private Double prevMaximumDraught;

    @Column(name = "next_maximumDraught")
    private Double nextMaximumDraught;

    @Column(name = "maximumDraught_changed", length = 10)
    private String maximumDraughtChanged;

    @Column(name = "maximumDraught_suspicious", length = 10)
    private String maximumDraughtSuspicious;

    @Column(name = "maximumDraught_outlier", length = 10)
    private String maximumDraughtOutlier;

    @Column(name = "maximumDraught_reverted", length = 10)
    private String maximumDraughtReverted;

    @Column(name = "maximumDraught_rapid_change", length = 10)
    private String maximumDraughtRapidChange;

    @Column(name = "maximumDraught_oscillating", length = 10)
    private String maximumDraughtOscillating;

    // Campos de tonnage
    @Column(name = "prev_tonnage")
    private Double prevTonnage;

    @Column(name = "next_tonnage")
    private Double nextTonnage;

    @Column(name = "tonnage_changed", length = 10)
    private String tonnageChanged;

    @Column(name = "tonnage_suspicious", length = 10)
    private String tonnageSuspicious;

    @Column(name = "tonnage_outlier", length = 10)
    private String tonnageOutlier;

    @Column(name = "tonnage_reverted", length = 10)
    private String tonnageReverted;

    @Column(name = "tonnage_rapid_change", length = 10)
    private String tonnageRapidChange;

    @Column(name = "tonnage_oscillating", length = 10)
    private String tonnageOscillating;

    // Campos de teuCapacity
    @Column(name = "prev_teuCapacity")
    private Double prevTeuCapacity; // Assuming this can be numeric for comparison

    @Column(name = "next_teuCapacity")
    private Double nextTeuCapacity; // Assuming this can be numeric for comparison

    @Column(name = "teuCapacity_changed", length = 10)
    private String teuCapacityChanged;

    @Column(name = "teuCapacity_suspicious", length = 10)
    private String teuCapacitySuspicious;

    @Column(name = "teuCapacity_outlier", length = 10)
    private String teuCapacityOutlier;

    @Column(name = "teuCapacity_reverted", length = 10)
    private String teuCapacityReverted;

    @Column(name = "teuCapacity_rapid_change", length = 10)
    private String teuCapacityRapidChange;

    @Column(name = "teuCapacity_oscillating", length = 10)
    private String teuCapacityOscillating;

    // Campos de maxSpeed
    @Column(name = "prev_maxSpeed")
    private Double prevMaxSpeed; // Assuming this can be numeric for comparison

    @Column(name = "next_maxSpeed")
    private Double nextMaxSpeed; // Assuming this can be numeric for comparison

    @Column(name = "maxSpeed_changed", length = 10)
    private String maxSpeedChanged;

    @Column(name = "maxSpeed_suspicious", length = 10)
    private String maxSpeedSuspicious;

    @Column(name = "maxSpeed_outlier", length = 10)
    private String maxSpeedOutlier;

    @Column(name = "maxSpeed_reverted", length = 10)
    private String maxSpeedReverted;

    @Column(name = "maxSpeed_rapid_change", length = 10)
    private String maxSpeedRapidChange;

    @Column(name = "maxSpeed_oscillating", length = 10)
    private String maxSpeedOscillating;

    // Campos de shipName
    @Column(name = "prev_shipName")
    private String prevShipNameVal; // Renamed to avoid conflict with 'shipName' field

    @Column(name = "next_shipName")
    private String nextShipNameVal; // Renamed to avoid conflict with 'shipName' field

    @Column(name = "shipName_changed", length = 10)
    private String shipNameChanged;

    @Column(name = "shipName_reverted", length = 10)
    private String shipNameReverted;

    @Column(name = "shipName_rapid_change", length = 10)
    private String shipNameRapidChange;

    @Column(name = "shipName_oscillating", length = 10)
    private String shipNameOscillating;

    // Campos de shipType
    @Column(name = "prev_shipType")
    private String prevShipTypeVal; // Renamed to avoid conflict with 'shipType' field

    @Column(name = "next_shipType")
    private String nextShipTypeVal; // Renamed to avoid conflict with 'shipType' field

    @Column(name = "shipType_changed", length = 10)
    private String shipTypeChanged;

    @Column(name = "shipType_reverted", length = 10)
    private String shipTypeReverted;

    @Column(name = "shipType_rapid_change", length = 10)
    private String shipTypeRapidChange;

    @Column(name = "shipType_oscillating", length = 10)
    private String shipTypeOscillating;

    // Campos de erro e validação
    @Column(name = "possible_error", length = 10)
    private String possibleError;

    @Column(name = "error_confidence")
    private Integer errorConfidence;

    @Column(name = "validation_date", length = 50)
    private String validationDate;

    // Campos de correção e porcentagem de mudança
    @Column(name = "breadthMoulded_corrected")
    private Double breadthMouldedCorrected;

    @Column(name = "breadthMoulded_pct_change")
    private Double breadthMouldedPctChange;

    @Column(name = "deadweight_corrected")
    private Double deadweightCorrected;

    @Column(name = "deadweight_pct_change")
    private Double deadweightPctChange;

    @Column(name = "gt_corrected")
    private Double gtCorrected;

    @Column(name = "gt_pct_change")
    private Double gtPctChange;

    @Column(name = "lbp_corrected")
    private Double lbpCorrected;

    @Column(name = "lbp_pct_change")
    private Double lbpPctChange;

    @Column(name = "loa_corrected")
    private Double loaCorrected;

    @Column(name = "loa_pct_change")
    private Double loaPctChange;

    @Column(name = "nt_corrected")
    private Double ntCorrected;

    @Column(name = "nt_pct_change")
    private Double ntPctChange;

    @Column(name = "maximumDraught_corrected")
    private Double maximumDraughtCorrected;

    @Column(name = "maximumDraught_pct_change")
    private Double maximumDraughtPctChange;

    @Column(name = "tonnage_corrected")
    private Double tonnageCorrected;

    @Column(name = "tonnage_pct_change")
    private Double tonnagePctChange;

    @Column(name = "teuCapacity_corrected")
    private Double teuCapacityCorrected;

    @Column(name = "teuCapacity_pct_change")
    private Double teuCapacityPctChange;

    @Column(name = "maxSpeed_corrected")
    private Double maxSpeedCorrected;

    @Column(name = "maxSpeed_pct_change")
    private Double maxSpeedPctChange;

    // Constructors, if needed
    public ShipDataEnhancement() {
    }
}