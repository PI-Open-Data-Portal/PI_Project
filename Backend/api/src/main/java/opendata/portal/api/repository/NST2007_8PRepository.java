package opendata.portal.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import opendata.portal.api.model.NST2007_8PTABLE;

@Repository
public interface NST2007_8PRepository extends JpaRepository<NST2007_8PTABLE, String> {
}