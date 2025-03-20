package opendata.portal.api.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import opendata.portal.api.model.NST2007_3PTABLE;
import opendata.portal.api.repository.NST2007_3PRepository;

@Service
public class NST2007_3PService {

    @Autowired
    private NST2007_3PRepository nst2007_3PRepository;

    public List<NST2007_3PTABLE> getNST2007_3P() {
        return nst2007_3PRepository.findAll();
    }

    public NST2007_3PTABLE getNST2007_3PById(String id) {
        return nst2007_3PRepository.findById(id).orElse(null);
    }

    public Page<NST2007_3PTABLE> getPaginatedNST2007_3P(Pageable pageable) {
        return nst2007_3PRepository.findAll(pageable);
    }
}