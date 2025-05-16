package opendata.portal.api.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import opendata.portal.api.model.ErrorReport;

@Repository
public interface ErrorReportRepository extends JpaRepository<ErrorReport, Long>, JpaSpecificationExecutor<ErrorReport> {
    List<ErrorReport> findByStatus(String status);
    List<ErrorReport> findByItemIdsContaining(Integer itemId);
}
