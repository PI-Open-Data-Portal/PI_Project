package opendata.portal.api.dto;

public class PortPairStatDTO {
    private String embarkationPort;
    private String disembarkationPort;
    private Long count;

    public PortPairStatDTO(String embarkationPort, String disembarkationPort, Long count) {
        this.embarkationPort = embarkationPort;
        this.disembarkationPort = disembarkationPort;
        this.count = count;
    }

    // Getters and setters
    public String getEmbarkationPort() {
        return embarkationPort;
    }

    public void setEmbarkationPort(String embarkationPort) {
        this.embarkationPort = embarkationPort;
    }

    public String getDisembarkationPort() {
        return disembarkationPort;
    }

    public void setDisembarkationPort(String disembarkationPort) {
        this.disembarkationPort = disembarkationPort;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }

}
