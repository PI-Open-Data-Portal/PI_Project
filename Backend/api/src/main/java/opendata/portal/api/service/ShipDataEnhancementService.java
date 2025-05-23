package opendata.portal.api.service;

import opendata.portal.api.model.ShipDataEnhancement;
import opendata.portal.api.repository.ShipDataEnhancementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ShipDataEnhancementService {

    private final ShipDataEnhancementRepository shipDataEnhancementRepository;

    public ShipDataEnhancementService(ShipDataEnhancementRepository shipDataEnhancementRepository) {
        this.shipDataEnhancementRepository = shipDataEnhancementRepository;
    }

    public Page<ShipDataEnhancement> getPaginatedShipData(Pageable pageable) {
        return shipDataEnhancementRepository.findAll(pageable);
    }
}