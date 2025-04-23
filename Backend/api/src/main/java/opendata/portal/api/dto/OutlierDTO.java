package opendata.portal.api.dto;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
@ToString
public class OutlierDTO {
    private Double Weight; // float -> Float
    private Integer ID; // int -> Integer
    private String prov2;
    private LocalDate Movement_Date;
    private String prov;

}