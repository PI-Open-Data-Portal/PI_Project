package opendata.portal.api.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.Date;
import opendata.portal.api.model.ContainerDetails;
import java.util.List;

@Repository
public interface ContainerDetailsRepository extends JpaRepository<ContainerDetails, String> {

    ContainerDetails findByCode(String code);

    Page<ContainerDetails> findAllBycreationDate(Pageable pageable, Date creation_date);

    Page<ContainerDetails> findAllByversionDate(Pageable pageable, Date version_date);

    Page<ContainerDetails> findAll(Pageable pageable);
}