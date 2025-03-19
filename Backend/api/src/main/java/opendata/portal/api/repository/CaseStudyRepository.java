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

}
