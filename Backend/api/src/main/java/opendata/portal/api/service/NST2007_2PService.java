package opendata.portal.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.Date;

import opendata.portal.api.model.NST2007_2PTABLE;
import opendata.portal.api.repository.NST2007_2PRepository;


@Service
public class NST2007_2PService {

    @Autowired
    private NST2007_2PRepository NST2007_2PRepository;

    public List<NST2007_2PTABLE> getNST2007_2P() {
        return NST2007_2PRepository.findAll();
    }

    public NST2007_2PTABLE getNST2007_2PById(String id) {
        return NST2007_2PRepository.findById(id).orElse(null);
    }

    public Page<NST2007_2PTABLE> getPaginatedNST2007_2P(Pageable pageable) {
        return NST2007_2PRepository.findAll(pageable);
    }

    
}
