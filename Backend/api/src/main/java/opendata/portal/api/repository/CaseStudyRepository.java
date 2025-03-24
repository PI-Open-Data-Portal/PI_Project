package opendata.portal.api.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import opendata.portal.api.model.CaseStudy;
import java.util.List;

@Repository
public interface CaseStudyRepository extends JpaRepository<CaseStudy, Integer> {

    // Find entries where prov2 starts with "ML"
    Page<CaseStudy> findByProv2StartingWith(Pageable pageable,String prefix);

    Page<CaseStudy> findAll(Pageable pageable);

    // 2P Products Query
    @Query(nativeQuery = true, 
           value = "SELECT cs.NST2007_2P as nst2007_2P, " +
                   "cs.NST2007_2P_Label_EN as nst2007_2PLabelEN, " +
                   "COUNT(*) as count " +
                   "FROM case_study cs " +
                   "GROUP BY cs.NST2007_2P, cs.NST2007_2P_Label_EN")
    List<Object[]> findNST2007_2PProductStats();

    // Prov2 Prefix Query
    @Query(nativeQuery = true, 
           value = "SELECT " +
                   "LEFT(cs.prov2, PATINDEX('%[0-9]%', cs.prov2) - 1) as provPrefix, " +
                   "COUNT(*) as count " +
                   "FROM case_study cs " +
                   "GROUP BY LEFT(cs.prov2, PATINDEX('%[0-9]%', cs.prov2) - 1)")
    List<Object[]> findProv2PrefixStats();

    // Weight Statistics Query
    @Query(nativeQuery = true, 
           value = "WITH OrderedWeights AS ( " +
                   "SELECT Weight, " +
                   "ROW_NUMBER() OVER (ORDER BY Weight) AS RowNum, " +
                   "COUNT(*) OVER () AS TotalCount " +
                   "FROM case_study " +
                   ") " +
                   "SELECT " +
                   "AVG(Weight) AS meanWeight, " +
                   "STDEV(Weight) AS stdDevWeight, " +
                   "(SELECT AVG(Weight) " +
                   "FROM OrderedWeights " +
                   "WHERE RowNum IN ((TotalCount + 1)/2, (TotalCount + 2)/2)) AS medianWeight " +
                   "FROM case_study")
    List<Object[]> findWeightStatistics();

    // Embarkation Port Frequency Query
    @Query(nativeQuery = true, 
           value = "SELECT Disembarkation_Port as DisembarkationPort, " +
                   "COUNT(*) as count " +
                   "FROM case_study " +
                   "WHERE Embarkation_Port = 'PTSIE' " +
                   "GROUP BY Disembarkation_Port")
    List<Object[]> findDisembarkationPortFrequency();

}
