package opendata.portal.api.repository;

import opendata.portal.api.model.ShipDataEnhancement;
import opendata.portal.api.model.ShipDataEnhancementId;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShipDataEnhancementRepository extends JpaRepository<ShipDataEnhancement, ShipDataEnhancementId> {
    // JpaRepository already provides findAll(Pageable pageable)
    // You can add custom query methods here if needed
}