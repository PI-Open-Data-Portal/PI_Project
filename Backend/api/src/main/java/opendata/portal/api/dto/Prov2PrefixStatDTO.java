package opendata.portal.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Prov2PrefixStatDTO {

    private String provPrefix;
    private Long count;

    public Prov2PrefixStatDTO(String provPrefix, Long count) {
        this.provPrefix = provPrefix;
        this.count = count;
    }
}