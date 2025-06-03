package opendata.portal.api.repository;

import opendata.portal.api.model.Entity_;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface Entity_Repository extends JpaRepository<Entity_, Integer> {
}
