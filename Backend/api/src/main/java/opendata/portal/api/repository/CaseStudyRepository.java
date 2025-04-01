package opendata.portal.api.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import opendata.portal.api.model.CaseStudy;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CaseStudyRepository extends JpaRepository<CaseStudy, Integer> , JpaSpecificationExecutor<CaseStudy> {

        // Find entries where prov2 starts with "ML"
        Page<CaseStudy> findByProv2StartingWith(Pageable pageable, String prefix);

        Page<CaseStudy> findAll(Pageable pageable);

        // 2P Products Query
        @Query(nativeQuery = true, value = "SELECT cs.NST2007_2P as nst2007_2P, " +
                        "cs.NST2007_2P_Label_EN as nst2007_2PLabelEN, " +
                        "COUNT(*) as count " +
                        "FROM case_study cs " +
                        "WHERE (:startDate IS NULL OR cs.Movement_Date >= :startDate) " +
                        "AND (:endDate IS NULL OR cs.Movement_Date <= :endDate) " +
                        "AND (:isTranshipment IS NULL OR cs.Transhipment = :isTranshipment) " +
                        "AND (:message IS NULL OR cs.message = :message) " +
                        "AND (:embarkationLocations IS NULL OR cs.Embarkation_Port IN (SELECT value FROM STRING_SPLIT(:embarkationLocations, ','))) "
                        +
                        "AND (:disembarkationLocations IS NULL OR cs.Disembarkation_Port IN (SELECT value FROM STRING_SPLIT(:disembarkationLocations, ','))) "
                        +
                        "GROUP BY cs.NST2007_2P, cs.NST2007_2P_Label_EN")
        List<Object[]> findNST2007_2PProductStats(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("isTranshipment") String isTranshipment,
                        @Param("message") String message,
                        @Param("embarkationLocations") String embarkationLocations,
                        @Param("disembarkationLocations") String disembarkationLocations);

        // Prov2 Prefix Statistics Query
        @Query(nativeQuery = true, value = "SELECT " +
                        "LEFT(cs.prov2, PATINDEX('%[0-9]%', cs.prov2) - 1) as provPrefix, " +
                        "COUNT(*) as count " +
                        "FROM case_study cs " +
                        "WHERE (:startDate IS NULL OR cs.Movement_Date >= :startDate) " +
                        "AND (:endDate IS NULL OR cs.Movement_Date <= :endDate) " +
                        "AND (:isTranshipment IS NULL OR cs.Transhipment = :isTranshipment) " +
                        "AND (:message IS NULL OR cs.message = :message) " +
                        "AND (:embarkationLocations IS NULL OR cs.Embarkation_Port IN (SELECT value FROM STRING_SPLIT(:embarkationLocations, ','))) "
                        +
                        "AND (:disembarkationLocations IS NULL OR cs.Disembarkation_Port IN (SELECT value FROM STRING_SPLIT(:disembarkationLocations, ','))) "
                        +
                        "GROUP BY LEFT(cs.prov2, PATINDEX('%[0-9]%', cs.prov2) - 1)")
        List<Object[]> findProv2PrefixStats(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("isTranshipment") String isTranshipment,
                        @Param("message") String message,
                        @Param("embarkationLocations") String embarkationLocations,
                        @Param("disembarkationLocations") String disembarkationLocations);

        // Weight Statistics Query
        @Query(nativeQuery = true, value = "WITH FilteredData AS ( " +
                        "SELECT Weight " +
                        "FROM case_study cs " +
                        "WHERE (:startDate IS NULL OR cs.Movement_Date >= :startDate) " +
                        "AND (:endDate IS NULL OR cs.Movement_Date <= :endDate) " +
                        "AND (:isTranshipment IS NULL OR cs.Transhipment = :isTranshipment) " +
                        "AND (:message IS NULL OR cs.message = :message) " +
                        "AND (:embarkationLocations IS NULL OR cs.Embarkation_Port IN (SELECT value FROM STRING_SPLIT(:embarkationLocations, ','))) "
                        +
                        "AND (:disembarkationLocations IS NULL OR cs.Disembarkation_Port IN (SELECT value FROM STRING_SPLIT(:disembarkationLocations, ','))) "
                        +
                        "), " +
                        "OrderedWeights AS ( " +
                        "SELECT Weight, " +
                        "ROW_NUMBER() OVER (ORDER BY Weight) AS RowNum, " +
                        "COUNT(*) OVER () AS TotalCount " +
                        "FROM FilteredData " +
                        ") " +
                        "SELECT " +
                        "AVG(Weight) AS meanWeight, " +
                        "STDEV(Weight) AS stdDevWeight, " +
                        "(SELECT AVG(Weight) " +
                        "FROM OrderedWeights " +
                        "WHERE RowNum IN ((TotalCount + 1)/2, (TotalCount + 2)/2)) AS medianWeight " +
                        "FROM FilteredData")
        List<Object[]> findWeightStatistics(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("isTranshipment") String isTranshipment,
                        @Param("message") String message,
                        @Param("embarkationLocations") String embarkationLocations,
                        @Param("disembarkationLocations") String disembarkationLocations);

        // Embarkation Port Frequency Query
        // Embarkation Port Frequency Query
        @Query(nativeQuery = true, value = "SELECT Disembarkation_Port as DisembarkationPort, " +
                        "COUNT(*) as count " +
                        "FROM case_study " +
                        "WHERE Embarkation_Port = 'PTSIE' " +
                        "GROUP BY Disembarkation_Port")
        List<Object[]> findDisembarkationPortFrequency();

        @Query(nativeQuery = true, value = "SELECT " +
                        "cs.Embarkation_Port as embarkationPort, " +
                        "cs.Disembarkation_Port as disembarkationPort, " +
                        "COUNT(*) as count " +
                        "FROM case_study cs " +
                        "WHERE (:startDate IS NULL OR cs.Movement_Date >= :startDate) " +
                        "AND (:endDate IS NULL OR cs.Movement_Date <= :endDate) " +
                        "AND (:isTranshipment IS NULL OR cs.Transhipment = :isTranshipment) " +
                        "AND (:message IS NULL OR cs.message = :message) " +
                        "AND (:embarkationLocations IS NULL OR cs.Embarkation_Port IN (SELECT value FROM STRING_SPLIT(:embarkationLocations, ','))) "
                        +
                        "AND (:disembarkationLocations IS NULL OR cs.Disembarkation_Port IN (SELECT value FROM STRING_SPLIT(:disembarkationLocations, ','))) "
                        +
                        "GROUP BY cs.Embarkation_Port, cs.Disembarkation_Port")
        List<Object[]> findPortPairFrequency(
                        @Param("startDate") LocalDate startDate,
                        @Param("endDate") LocalDate endDate,
                        @Param("isTranshipment") String isTranshipment,
                        @Param("message") String message,
                        @Param("embarkationLocations") String embarkationLocations,
                        @Param("disembarkationLocations") String disembarkationLocations);
}
