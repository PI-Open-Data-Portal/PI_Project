package opendata.portal.api;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootApplication
public class ApiApplication  {
    private static final Logger log = LoggerFactory.getLogger(ApiApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
        try {
            Driver driver = DriverManager.getDriver("jdbc:sqlserver://");
            log.info("Driver JDBC loaded: " + driver.getClass().getName());
        } catch (SQLException e) {
            log.error("Error loading JDBC driver: " + e.getMessage());
        }
    }

	// Test connection to the database
    // @Autowired
    // JdbcTemplate jdbcTemplate;

    // @Override
    // public void run(String... args) throws Exception {
    //     log.info("Querying case_study table...");

    //     // Get column names first to make the output more readable
    //     jdbcTemplate.query("SELECT TOP 1 * FROM case_study", (rs, rowNum) -> {
    //         int columnCount = rs.getMetaData().getColumnCount();
    //         StringBuilder columns = new StringBuilder("Columns: ");
    //         for (int i = 1; i <= columnCount; i++) {
    //             columns.append(rs.getMetaData().getColumnName(i)).append(", ");
    //         }
    //         log.info(columns.toString());
    //         return null;
    //     });

    //     jdbcTemplate.query("SELECT * FROM case_study", (rs, rowNum) -> {
    //         StringBuilder row = new StringBuilder("Row ").append(rowNum).append(": ");
    //         int columnCount = rs.getMetaData().getColumnCount();
            
    //         for (int i = 1; i <= columnCount; i++) {
    //             String columnName = rs.getMetaData().getColumnName(i);
    //             String value = rs.getString(i);
    //             row.append(columnName).append("=").append(value).append(", ");
    //         }
            
    //         log.info(row.toString());
    //         return null;
    //     });
    // }
}