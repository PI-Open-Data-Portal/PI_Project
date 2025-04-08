package opendata.portal.api.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import opendata.portal.api.model.NST2007_8PTABLE;
import opendata.portal.api.repository.NST2007_8PRepository;

@Service
public class NST2007_8PService {

    @Autowired
    private NST2007_8PRepository nst2007_8PRepository;

    public List<NST2007_8PTABLE> getNST2007_8P() {
        return nst2007_8PRepository.findAll();
    }

    public NST2007_8PTABLE getNST2007_8PById(String id) {
        return nst2007_8PRepository.findById(id).orElse(null);
    }

    public Page<NST2007_8PTABLE> getPaginatedNST2007_8P(Pageable pageable) {
        return nst2007_8PRepository.findAll(pageable);
    }
}