package opendata.portal.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DisembarkationPortStatDTO {
    private String DisembarkationPort;
    private Long count;

    public DisembarkationPortStatDTO(String DisembarkationPort, Long count) {
        this.DisembarkationPort = DisembarkationPort;
        this.count = count;
    }
    
}
