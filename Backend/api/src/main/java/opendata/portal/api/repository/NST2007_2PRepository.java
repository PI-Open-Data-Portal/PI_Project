package opendata.portal.api.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import opendata.portal.api.model.CaseStudy;
import opendata.portal.api.model.NST2007_2PTABLE;

import java.util.List;

@Repository
public interface NST2007_2PRepository extends JpaRepository<NST2007_2PTABLE, String> {
    Page<NST2007_2PTABLE> findAll(Pageable pageable);



}
