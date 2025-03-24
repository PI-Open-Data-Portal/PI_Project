package opendata.portal.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WeightStatisticsDTO {
    private Double meanWeight;
    private Double medianWeight;
    private Double stdDevWeight;

    public WeightStatisticsDTO(Double meanWeight, Double medianWeight, Double stdDevWeight) {
        this.meanWeight = meanWeight;
        this.medianWeight = medianWeight;
        this.stdDevWeight = stdDevWeight;
    }
}
