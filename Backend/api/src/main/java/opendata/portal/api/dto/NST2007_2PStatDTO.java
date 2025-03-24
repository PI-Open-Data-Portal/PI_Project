package opendata.portal.api.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NST2007_2PStatDTO {
    private String nst2007_2P;
    private String nst2007_2PLabelEN;
    private Long count;

    public NST2007_2PStatDTO(String nst2007_2P, String nst2007_2PLabelEN, Long count) {
        this.nst2007_2P = nst2007_2P;
        this.nst2007_2PLabelEN = nst2007_2PLabelEN;
        this.count = count;
    }
}