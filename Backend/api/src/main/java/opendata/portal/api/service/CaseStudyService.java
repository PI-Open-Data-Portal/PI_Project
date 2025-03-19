package opendata.portal.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import opendata.portal.api.repository.CaseStudyRepository;
import opendata.portal.api.model.CaseStudy;

@Service
public class CaseStudyService {

    @Autowired
    private CaseStudyRepository caseStudyRepository;

    public List<CaseStudy> getCaseStudies() {
        return caseStudyRepository.findAll();
    }

    public CaseStudy getCaseStudyById(int id) {
        return caseStudyRepository.findById(id).orElse(null);
    }

    public Page<CaseStudy> getCasesStudyByProv2(Pageable pageable, String prov) {
        return caseStudyRepository.findByProv2StartingWith(pageable, prov);
    }

    public Page<CaseStudy> getPaginatedCaseStudies(Pageable pageable) {
        return caseStudyRepository.findAll(pageable);
    }
}
