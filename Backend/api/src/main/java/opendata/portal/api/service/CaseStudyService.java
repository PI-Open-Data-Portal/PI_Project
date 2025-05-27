package opendata.portal.api.service;

import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path; // Ensure this is the correct Path class from java.nio.file
import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.io.ByteArrayOutputStream;
import java.lang.reflect.Field;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.Tuple;

import org.springframework.data.jpa.domain.Specification;

import opendata.portal.api.repository.CaseStudyRepository;
import opendata.portal.api.model.Activity;
import opendata.portal.api.model.Agent;
import opendata.portal.api.model.CaseStudy;
import opendata.portal.api.model.Entity_;
import opendata.portal.api.controller.CaseStudyApiController;
import opendata.portal.api.dto.DisembarkationPortStatDTO;
import opendata.portal.api.dto.NST2007_2PStatDTO;
import opendata.portal.api.dto.OutlierDTO;
import opendata.portal.api.dto.PortPairStatDTO;
import opendata.portal.api.dto.Prov2PrefixStatDTO;
import opendata.portal.api.dto.WeightStatisticsDTO;
import opendata.portal.api.util.OutputStreamOutputFile;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.parquet.Log;
import org.apache.parquet.example.data.Group;
import org.apache.parquet.example.data.simple.SimpleGroupFactory;
import org.apache.parquet.format.DateType;
import org.apache.parquet.hadoop.ParquetWriter;
import org.apache.parquet.hadoop.example.ExampleParquetWriter;
import org.apache.parquet.hadoop.metadata.CompressionCodecName;
import org.apache.parquet.schema.MessageType;
import org.apache.parquet.schema.OriginalType;
import org.apache.parquet.schema.PrimitiveType.PrimitiveTypeName;
import org.apache.parquet.schema.Types;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.stream.Collectors;

@Service
public class CaseStudyService {

    @Autowired
    private CaseStudyRepository caseStudyRepository;

    @Autowired
    private AgentService agentService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private Entity_Service entityService;

    public List<CaseStudy> getCaseStudies() {
        return caseStudyRepository.findAll();
    }

    public CaseStudy getCaseStudyById(int id) {
        return caseStudyRepository.findById(id).orElse(null);
    }

    public Page<CaseStudy> getCasesStudyByProv2(Pageable pageable, String prov) {
        return caseStudyRepository.findByProv2StartingWith(pageable, prov);
    }

    @PersistenceContext
    private EntityManager entityManager;

    private static final Logger log = LoggerFactory.getLogger(CaseStudyService.class);

    public Page<CaseStudy> getPaginatedCaseStudies(Pageable pageable,
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations,
            String type,
            String harmonizedCode,
            String containerPlate) {

        // Validate message if provided
        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }

        // Use Specification to build dynamic query with the same filters
        Specification<CaseStudy> spec = Specification.where(null);

        // Código existente para os parâmetros atuais...

        // Adicionar condição para o parâmetro type
        if (type != null && !type.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("prov2"), type + "%"));
        }

        // Adicionar condição para o parâmetro harmonizedCode
        if (harmonizedCode != null && !harmonizedCode.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("harmonizedCode"), harmonizedCode));
        }

        // Adicionar condição para o parâmetro containerPlate
        if (containerPlate != null && !containerPlate.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("containerPlate"), "%" + containerPlate + "%"));
        }

        return caseStudyRepository.findAll(spec, pageable);
    }

    public List<NST2007_2PStatDTO> getNST2007_2PProductStats(
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations) {

        // Validate message if provided
        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }
        String transhipmentValue = null;
        if (isTranshipment != null) {
            transhipmentValue = isTranshipment ? "S" : "N";
        }
        List<Object[]> results = caseStudyRepository.findNST2007_2PProductStats(
                startDate, endDate, transhipmentValue, message, embarkationLocations, disembarkationLocations);

        return results.stream()
                .map(result -> new NST2007_2PStatDTO(
                        (String) result[0],
                        (String) result[1],
                        ((Number) result[2]).longValue()))
                .collect(Collectors.toList());
    }

    private boolean isValidMessage(String message) {
        Set<String> validMessages = Set.of(
                "ARRIVAL_ANNOUNCEMENT", "ARRIVAL_GUIDE", "DECONSOLIDATION_GUIDE",
                "DEPARTURE_GUIDE", "DISEMBARKATION_REPORT", "EMBARKATION_REPORT",
                "LOAD_INSTRUCTION", "LOAD_REPORT", "UNLOAD_INSTRUCTION", "UNLOAD_REPORT",
                "VERIFIED_WEIGHING");

        return validMessages.contains(message);
    }

    public List<Prov2PrefixStatDTO> getProv2PrefixStats(
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations) {
        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }
        String transhipmentValue = null;
        if (isTranshipment != null) {
            transhipmentValue = isTranshipment ? "S" : "N";
        }
        List<Object[]> results = caseStudyRepository.findProv2PrefixStats(startDate, endDate, transhipmentValue,
                message,
                embarkationLocations, disembarkationLocations);
        return results.stream()
                .map(result -> new Prov2PrefixStatDTO(
                        (String) result[0],
                        ((Number) result[1]).longValue()))
                .collect(Collectors.toList());
    }

    public WeightStatisticsDTO getWeightStatistics(LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations) {
        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }
        String transhipmentValue = null;
        if (isTranshipment != null) {
            transhipmentValue = isTranshipment ? "S" : "N";
        }
        List<Object[]> results = caseStudyRepository.findWeightStatistics(startDate, endDate, transhipmentValue,
                message,
                embarkationLocations, disembarkationLocations);
        if (results.isEmpty()) {
            return new WeightStatisticsDTO(0.0, 0.0, 0.0);
        }
        Object[] result = results.get(0);
        return new WeightStatisticsDTO(
                ((Number) result[0]).doubleValue(),
                ((Number) result[2]).doubleValue(),
                ((Number) result[1]).doubleValue());
    }

    public List<DisembarkationPortStatDTO> getEmbarkationPortFrequency() {
        List<Object[]> results = caseStudyRepository.findDisembarkationPortFrequency();
        return results.stream()
                .map(result -> new DisembarkationPortStatDTO(
                        (String) result[0],
                        ((Number) result[1]).longValue()))
                .collect(Collectors.toList());
    }

    public List<PortPairStatDTO> getPortPairFrequency(
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations) {

        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }
        String transhipmentValue = null;
        if (isTranshipment != null) {
            transhipmentValue = isTranshipment ? "S" : "N";
        }
        List<Object[]> results = caseStudyRepository.findPortPairFrequency(
                startDate, endDate, transhipmentValue, message, embarkationLocations, disembarkationLocations);

        return results.stream()
                .map(result -> new PortPairStatDTO(
                        (String) result[0], // embarkationPort
                        (String) result[1], // disembarkationPort
                        ((Number) result[2]).longValue())) // count
                .collect(Collectors.toList());
    }

    // Constructor injection
    public CaseStudyService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    /**
     * Downloads case studies with selective columns and efficient processing
     */
    public byte[] downloadCaseStudies(
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations,
            String type,
            List<String> columns,
            String format) throws Exception {

        // Default to all columns if none are provided
        if (columns == null || columns.isEmpty()) {
            columns = Arrays.asList(
                    "id",
                    "containerPlate",
                    "cargoDescription",
                    "message",
                    "movementDate",
                    "embarkationPort",
                    "disembarkationPort",
                    "transhipment",
                    "isoContentainer",
                    "isoContentainerRegistry",
                    "containerTare",
                    "containerState",
                    "harmonizedCode",
                    "weight",
                    "brokenPackagesQuantity",
                    "packagesQuantity",
                    "departureWeight",
                    "cn20078PLabelEN",
                    "nst20073P",
                    "nst20073PLabelEN",
                    "nst20072P",
                    "nst20072PLabelEN",
                    "prov",
                    "prov2");
        }

        // Build the column selection string
        String columnsString = buildColumnSelectionString(columns);

        // Fetch data with pagination and generate output
        List<Map<String, Object>> results = fetchDataWithPagination(
                columnsString, startDate, endDate,
                isTranshipment != null ? isTranshipment.toString() : null,
                message, embarkationLocations, disembarkationLocations);

        log.info("Fetched {} records", results.size());

        byte[] fileContent;

        // Generate the appropriate format
        String formatLower = format.toLowerCase();
        switch (formatLower) {
            case "csv":
                fileContent = generateCsvFromMaps(results, columns);
                break;
            case "parquet":
                fileContent = generateParquetFromMaps(results, columns);
                break;
            case "json":
            default:
                fileContent = generateJsonFromMaps(results);
                break;
        }

        // ---- Provenance Logging Start ----
        try {
            Agent downloadAgent = agentService.getAgentById(1); // Agent ID 1 for downloads
            if (downloadAgent == null) {
                log.warn("Agent with ID 1 not found for download provenance logging. Skipping provenance log.");
            } else {
                LocalDateTime now = LocalDateTime.now();

                // 1. Create the Download Activity
                Activity downloadActivity = new Activity();
                downloadActivity.setId(UUID.randomUUID().toString());
                downloadActivity.setDescription(
                        String.format("Download of Case Study data as %s.", formatLower));
                downloadActivity.setType("DataDownloadOperation");
                downloadActivity.setStartedDate(now);
                downloadActivity.setEndDate(now);
                downloadActivity.getAssociatedAgents().add(downloadAgent); // Link Agent to Activity

                // 2. Create Entity for the Source Table (case_study)
                Entity_ sourceTableEntity = new Entity_();
                sourceTableEntity.setDescription("Case study data source table: PRJ_LEI_2025.dbo.case_study");
                sourceTableEntity.setType("DatasetTable");
                sourceTableEntity.setResourcePath("PRJ_LEI_2025.dbo.case_study"); // As requested
                sourceTableEntity.setCreationDate(now); // Represents the time of this access instance for provenance

                // Link Source Table Entity as "used" by the Activity
                // Entity_ is the owner of the "Used" relationship, so save it after setting its
                // side.
                sourceTableEntity.getUsedInActivities().add(downloadActivity);
                entityService.saveEntity(sourceTableEntity);

                // Add to activity's collection for object graph consistency and to establish
                // the link from Activity's perspective
                downloadActivity.getEntitiesUsingThisActivity().add(sourceTableEntity);

                // 3. Create Entity for the Generated Report File
                Entity_ reportFileEntity = new Entity_();
                reportFileEntity.setDescription(String.format(
                        "Downloaded Case Study report file (format: %s).", formatLower));
                reportFileEntity.setType("DownloadedReportFile");
                String reportFileExtension = formatLower; // e.g., "csv", "json", "parquet"
                // Making the timestamp in path more file-system friendly
                String timestampForPath = now.toString().replace(":", "-").replace(".", "-").replace("T", "_");
                reportFileEntity.setResourcePath(String.format("downloaded_reports/case_studies/%s/report_%s.%s",
                        formatLower, timestampForPath, reportFileExtension));
                reportFileEntity.setCreationDate(now);
                reportFileEntity.setCreatingActivity(downloadActivity); // Link Report File to its creating Activity

                // Link Report File as "generatedBy" the Activity
                downloadActivity.getCreatedEntities().add(reportFileEntity);

                // Save the Activity. This will also save the reportFileEntity due to cascade
                // (assuming Activity.createdEntities has CascadeType.ALL or PERSIST)
                // and update relationships for entitiesUsingThisActivity.
                activityService.saveActivity(downloadActivity);

                log.info(
                        "Provenance logged for download. Activity ID: {}, SourceTableEntity ID: {}, ReportFileEntity ID: {}",
                        downloadActivity.getId(), sourceTableEntity.getId(), reportFileEntity.getId());
            }
        } catch (Exception e) {
            log.error("Error logging provenance for case study download: {}", e.getMessage(), e);
            // Do not fail the download itself, just log the error.
        }
        // ---- Provenance Logging End ----

        return fileContent;
    }

    /**
     * Builds a SQL-safe column selection string from the requested columns
     */
    private String buildColumnSelectionString(List<String> columns) {
        // Validate column names exist in our mapping
        List<String> validatedColumns = columns.stream()
                .filter(FIELD_TO_COLUMN_MAP::containsKey)
                .map(FIELD_TO_COLUMN_MAP::get)
                .collect(Collectors.toList());

        // If no valid columns, select "ID" as a default
        if (validatedColumns.isEmpty()) {
            validatedColumns.add("ID");
        }

        // Build the column string for the SQL query with explicit column selection
        // This prevents SQL injection by using a predefined list of valid columns
        return validatedColumns.stream()
                .map(col -> "cs." + col)
                .collect(Collectors.joining(", "));
    }

    /**
     * Fetches data in pages to handle very large datasets efficiently
     */
    private List<Map<String, Object>> fetchDataWithPagination(
            String columnsString, LocalDate startDate, LocalDate endDate,
            String isTranshipment, String message,
            String embarkationLocations, String disembarkationLocations) {

        final int pageSize = 10000; // Adjust based on memory constraints
        final List<Map<String, Object>> allResults = new ArrayList<>();

        // Base query with positional parameters for security
        StringBuilder baseQueryBuilder = new StringBuilder();
        baseQueryBuilder.append("SELECT ").append(columnsString)
                .append(" FROM case_study cs WHERE ")
                .append("(:startDate IS NULL OR cs.Movement_Date >= :startDate) ")
                .append("AND (:endDate IS NULL OR cs.Movement_Date <= :endDate) ")
                .append("AND (:isTranshipment IS NULL OR cs.Transhipment = :isTranshipment) ")
                .append("AND (:message IS NULL OR cs.message = :message) ");

        // Only add embarkation locations if provided
        if (embarkationLocations != null && !embarkationLocations.isEmpty()) {
            baseQueryBuilder
                    .append("AND cs.Embarkation_Port IN (SELECT value FROM STRING_SPLIT(:embarkationLocations, ',')) ");
        }

        // Only add disembarkation locations if provided
        if (disembarkationLocations != null && !disembarkationLocations.isEmpty()) {
            baseQueryBuilder.append(
                    "AND cs.Disembarkation_Port IN (SELECT value FROM STRING_SPLIT(:disembarkationLocations, ',')) ");
        }

        // Add pagination
        baseQueryBuilder.append("ORDER BY cs.id ")
                .append("OFFSET :offset ROWS FETCH NEXT :pageSize ROWS ONLY");

        String baseQuery = baseQueryBuilder.toString();
        int offset = 0;
        boolean hasMoreData = true;

        while (hasMoreData) {
            Query query = entityManager.createNativeQuery(baseQuery, Tuple.class);
            query.setParameter("startDate", startDate);
            query.setParameter("endDate", endDate);
            query.setParameter("isTranshipment", isTranshipment);
            query.setParameter("message", message);

            // Only set parameters if they were used in the query
            if (embarkationLocations != null && !embarkationLocations.isEmpty()) {
                query.setParameter("embarkationLocations", embarkationLocations);
            }

            if (disembarkationLocations != null && !disembarkationLocations.isEmpty()) {
                query.setParameter("disembarkationLocations", disembarkationLocations);
            }

            query.setParameter("offset", offset);
            query.setParameter("pageSize", pageSize);

            List<Tuple> pageResults = query.getResultList();

            if (pageResults.isEmpty()) {
                hasMoreData = false;
            } else {
                // Convert tuples to maps and add to results
                pageResults.forEach(tuple -> {
                    Map<String, Object> row = new HashMap<>();
                    tuple.getElements().forEach(te -> {
                        String alias = te.getAlias();
                        Object value = tuple.get(alias);
                        row.put(convertDbColumnToField(alias), value);
                    });
                    allResults.add(row);
                });

                offset += pageSize;
            }
        }

        return allResults;
    }

    /**
     * Maps DB column names back to field names for API consistency
     */
    private String convertDbColumnToField(String dbColumnName) {
        // Remove the table alias if present
        String columnName = dbColumnName.contains(".") ? dbColumnName.substring(dbColumnName.indexOf(".") + 1)
                : dbColumnName;

        // Find the matching field name
        for (Map.Entry<String, String> entry : FIELD_TO_COLUMN_MAP.entrySet()) {
            if (entry.getValue().equals(columnName)) {
                return entry.getKey();
            }
        }

        // If no match, return the original column name
        return columnName;
    }

    /**
     * Generates CSV output from map data
     */
    private byte[] generateCsvFromMaps(List<Map<String, Object>> data, List<String> columns) throws IOException {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        try (CSVPrinter csvPrinter = new CSVPrinter(
                new OutputStreamWriter(outputStream),
                CSVFormat.DEFAULT.withHeader(columns.toArray(new String[0])))) {

            for (Map<String, Object> row : data) {
                List<Object> values = new ArrayList<>();
                for (String column : columns) {
                    values.add(row.get(column));
                }
                csvPrinter.printRecord(values);
            }
        }

        return outputStream.toByteArray();
    }

    /**
     * Generates JSON output from map data
     */
    private byte[] generateJsonFromMaps(List<Map<String, Object>> data) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // For proper LocalDate handling
        objectMapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        return objectMapper.writeValueAsBytes(data);
    }

    /**
     * Generates Parquet output from map data
     */
    private byte[] generateParquetFromMaps(List<Map<String, Object>> data, List<String> columns) throws IOException {
        // Use ByteArrayOutputStream to keep everything in memory
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        // Create dynamic schema based on selected columns and their types
        MessageType schema = createDynamicParquetSchema(data, columns);

        try (ParquetWriter<Group> writer = ExampleParquetWriter.builder(new OutputStreamOutputFile(outputStream))
                .withType(schema)
                .withCompressionCodec(CompressionCodecName.SNAPPY)
                .withRowGroupSize(100 * 1024 * 1024) // 100MB per row group
                .withPageSize(1 * 1024 * 1024) // 1MB page size
                .withDictionaryEncoding(true)
                .build()) {

            SimpleGroupFactory groupFactory = new SimpleGroupFactory(schema);

            // Write each row to Parquet
            for (Map<String, Object> row : data) {
                Group group = groupFactory.newGroup();

                for (String colName : columns) {
                    Object value = row.get(colName);
                    if (value != null) {
                        addValueToGroup(group, colName, value);
                    }
                }

                writer.write(group);
            }
        }

        // Return the byte array
        return outputStream.toByteArray();
    }

    /**
     * Creates a dynamic Parquet schema based on data types
     */
    private MessageType createDynamicParquetSchema(List<Map<String, Object>> data, List<String> columns) {
        Types.MessageTypeBuilder builder = Types.buildMessage();

        // Try to detect types from first non-null values
        Map<String, Class<?>> columnTypes = new HashMap<>();

        // Find first row with non-null values for type detection
        for (Map<String, Object> row : data) {
            for (String col : columns) {
                if (!columnTypes.containsKey(col) && row.get(col) != null) {
                    columnTypes.put(col, row.get(col).getClass());
                }
            }

            // If we got types for all columns, break
            if (columnTypes.size() == columns.size()) {
                break;
            }
        }

        // Add fields to schema
        for (String col : columns) {
            Class<?> type = columnTypes.getOrDefault(col, String.class); // Default to string

            if (String.class.isAssignableFrom(type)) {
                builder.addField(
                        Types.optional(PrimitiveTypeName.BINARY).as(OriginalType.UTF8).named(col));
            } else if (Integer.class.isAssignableFrom(type) || int.class.isAssignableFrom(type)) {
                builder.addField(Types.optional(PrimitiveTypeName.INT32).named(col));
            } else if (Long.class.isAssignableFrom(type) || long.class.isAssignableFrom(type)) {
                builder.addField(Types.optional(PrimitiveTypeName.INT64).named(col));
            } else if (Double.class.isAssignableFrom(type) || double.class.isAssignableFrom(type) ||
                    Float.class.isAssignableFrom(type) || float.class.isAssignableFrom(type)) {
                builder.addField(Types.optional(PrimitiveTypeName.DOUBLE).named(col));
            } else if (Boolean.class.isAssignableFrom(type) || boolean.class.isAssignableFrom(type)) {
                builder.addField(Types.optional(PrimitiveTypeName.BOOLEAN).named(col));
            } else if (LocalDate.class.isAssignableFrom(type)) {
                builder.addField(
                        Types.optional(PrimitiveTypeName.INT32).as(OriginalType.DATE).named(col));
            } else {
                // Default to string for unknown types
                builder.addField(
                        Types.optional(PrimitiveTypeName.BINARY).as(OriginalType.UTF8).named(col));
            }
        }

        return builder.named("case_study");
    }

    /**
     * Adds a value to a Parquet Group based on its type
     */
    private void addValueToGroup(Group group, String colName, Object value) {
        if (value instanceof String) {
            group.add(colName, (String) value);
        } else if (value instanceof Integer) {
            group.add(colName, (Integer) value);
        } else if (value instanceof Long) {
            group.add(colName, (Long) value);
        } else if (value instanceof Double) {
            group.add(colName, (Double) value);
        } else if (value instanceof Float) {
            group.add(colName, (Float) value);
        } else if (value instanceof Boolean) {
            group.add(colName, (Boolean) value);
        } else if (value instanceof LocalDate) {
            // Convert LocalDate to days since epoch for Parquet DATE type
            int days = (int) ((LocalDate) value).toEpochDay();
            group.add(colName, days);
        } else if (value instanceof Date) {
            // Convert java.util.Date to days since epoch
            LocalDate localDate = ((Date) value).toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            int days = (int) localDate.toEpochDay();
            group.add(colName, days);
        } else {
            // Default to string representation for unknown types
            group.add(colName, value.toString());
        }
    }

    /**
     * Helper class to bridge ParquetWriter with ByteArrayOutputStream
     */
    private static class OutputStreamOutputFile implements org.apache.parquet.io.OutputFile {
        private final ByteArrayOutputStream outputStream;

        public OutputStreamOutputFile(ByteArrayOutputStream outputStream) {
            this.outputStream = outputStream;
        }

        @Override
        public org.apache.parquet.io.PositionOutputStream create(long blockSizeHint) {
            return new ByteArrayOutputStreamPositionOutputStream(outputStream);
        }

        @Override
        public org.apache.parquet.io.PositionOutputStream createOrOverwrite(long blockSizeHint) {
            outputStream.reset();
            return create(blockSizeHint);
        }

        @Override
        public boolean supportsBlockSize() {
            return false;
        }

        @Override
        public long defaultBlockSize() {
            return 0;
        }
    }

    /**
     * Position tracking wrapper for ByteArrayOutputStream
     */
    private static class ByteArrayOutputStreamPositionOutputStream extends org.apache.parquet.io.PositionOutputStream {
        private final ByteArrayOutputStream outputStream;
        private long position = 0;

        public ByteArrayOutputStreamPositionOutputStream(ByteArrayOutputStream outputStream) {
            this.outputStream = outputStream;
        }

        @Override
        public void write(int b) throws IOException {
            outputStream.write(b);
            position++;
        }

        @Override
        public void write(byte[] b) throws IOException {
            outputStream.write(b);
            position += b.length;
        }

        @Override
        public void write(byte[] b, int off, int len) throws IOException {
            outputStream.write(b, off, len);
            position += len;
        }

        @Override
        public long getPos() {
            return position;
        }

        @Override
        public void flush() throws IOException {
            outputStream.flush();
        }

        @Override
        public void close() throws IOException {
            // ByteArrayOutputStream doesn't need closing
        }
    }

    // Map that connects Java field names to database column names
    private static final Map<String, String> FIELD_TO_COLUMN_MAP = Map.ofEntries(
            Map.entry("id", "ID"),
            Map.entry("containerPlate", "Container_Plate"),
            Map.entry("cargoDescription", "Cargo_Description"),
            Map.entry("message", "Message"),
            Map.entry("movementDate", "Movement_Date"),
            Map.entry("embarkationPort", "Embarkation_Port"),
            Map.entry("disembarkationPort", "Disembarkation_Port"),
            Map.entry("transhipment", "Transhipment"),
            Map.entry("isoContentainer", "ISO_contentainer"),
            Map.entry("isoContentainerRegistry", "ISO_contentainer_Registry"),
            Map.entry("containerTare", "Container_Tare"),
            Map.entry("containerState", "Container_State"),
            Map.entry("harmonizedCode", "Harmonized_Code"),
            Map.entry("weight", "Weight"),
            Map.entry("brokenPackagesQuantity", "Broken_Packages_Quantity"),
            Map.entry("packagesQuantity", "Packages_Quantity"),
            Map.entry("departureWeight", "Departure_Weight"),
            Map.entry("cn20078PLabelEN", "CN2007_8P_Label_EN"),
            Map.entry("nst20073P", "NST2007_3P"),
            Map.entry("nst20073PLabelEN", "NST2007_3P_Label_EN"),
            Map.entry("nst20072P", "NST2007_2P"),
            Map.entry("nst20072PLabelEN", "NST2007_2P_Label_EN"),
            Map.entry("prov", "prov"),
            Map.entry("prov2", "prov2"));

    public List<OutlierDTO> getOutliers() {
        log.info("Fetching outliers");
        List<Object[]> result = caseStudyRepository.findOutliers();
        List<OutlierDTO> rawDtos = new ArrayList<>();
        for (Object[] row : result) {
            OutlierDTO outlier = new OutlierDTO();
            outlier.setWeight((Double) row[0]);
            outlier.setID((Integer) row[1]);
            outlier.setProv2((String) row[2]);
            java.util.Date date = (java.util.Date) row[3]; // java.sql.Date herda de java.util.Date
            outlier.setMovement_Date(
                    new Timestamp(date.getTime()).toLocalDateTime().toLocalDate());
            outlier.setProv((String) row[4]);
            rawDtos.add(outlier);
        }
        log.info("Fetched {} outliers", rawDtos.size());
        return rawDtos;
    }

    public List<OutlierDTO> getOutliersWithFilters(
            LocalDate startDate, LocalDate endDate, Double minWeight, Double maxWeight,
            Integer id, String provType) {

        log.info("Fetching outliers with filters");

        // Get base outliers
        List<OutlierDTO> allOutliers = getOutliers();

        // Apply filters
        List<OutlierDTO> filteredOutliers = allOutliers.stream()
                .filter(outlier -> {
                    // Filter by date if specified
                    if (startDate != null && outlier.getMovement_Date() != null
                            && outlier.getMovement_Date().isBefore(startDate)) {
                        return false;
                    }

                    if (endDate != null && outlier.getMovement_Date() != null
                            && outlier.getMovement_Date().isAfter(endDate)) {
                        return false;
                    }

                    // Filter by weight if specified
                    if (minWeight != null && outlier.getWeight() < minWeight) {
                        return false;
                    }

                    if (maxWeight != null && outlier.getWeight() > maxWeight) {
                        return false;
                    }

                    // Filter by ID if specified
                    if (id != null && outlier.getID() != id) {
                        return false;
                    }

                    // Filter by provenance type if specified
                    if (provType != null && !provType.isEmpty()) {
                        // Extract letters from prov2 for matching
                        String extractedProv = outlier.getProv2() != null
                                ? outlier.getProv2().replaceAll("[^A-Za-z]", "")
                                : "";
                        return extractedProv.equals(provType);
                    }

                    return true;
                })
                .collect(Collectors.toList());

        log.info("Filtered from {} to {} outliers", allOutliers.size(), filteredOutliers.size());
        return filteredOutliers;
    }
}
