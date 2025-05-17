package opendata.portal.api.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorReportDTO {
    private Long id;
    private List<Integer> itemIds;
    private String errorType;
    private String description;
    private String reporter;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String severity;
}
