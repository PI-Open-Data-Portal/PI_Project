package opendata.portal.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Date;
import opendata.portal.api.repository.ContainerDetailsRepository;
import opendata.portal.api.model.ContainerDetails;

@Service
public class ContainerDetailsService {

    @Autowired
    private ContainerDetailsRepository ContainerDetailsRepository;

    public List<ContainerDetails> getContainerDetails() {
        return ContainerDetailsRepository.findAll();
    }

    public ContainerDetails getContainerDetailsByCode(String code) {
        return ContainerDetailsRepository.findByCode(code);
    }

    public Page<ContainerDetails> getAllBycreation_date(Pageable pageable, Date date) {
        return ContainerDetailsRepository.findAllBycreationDate(pageable, date);
    }

    public Page<ContainerDetails> getAllByversion_date(Pageable pageable, Date date) {
        return ContainerDetailsRepository.findAllByversionDate(pageable, date);
    }

    public Page<ContainerDetails> getPaginatedContainerDetails(Pageable pageable) {
        return ContainerDetailsRepository.findAll(pageable);
    }
}
