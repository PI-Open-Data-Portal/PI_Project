package opendata.portal.api.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import opendata.portal.api.repository.CaseStudyRepository;
import opendata.portal.api.model.CaseStudy;
import opendata.portal.api.dto.DisembarkationPortStatDTO;
import opendata.portal.api.dto.NST2007_2PStatDTO;
import opendata.portal.api.dto.Prov2PrefixStatDTO;
import opendata.portal.api.dto.WeightStatisticsDTO;
import opendata.portal.api.repository.CaseStudyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    public List<NST2007_2PStatDTO> getNST2007_2PProductStats() {
        List<Object[]> results = caseStudyRepository.findNST2007_2PProductStats();
        return results.stream()
                .map(result -> new NST2007_2PStatDTO(
                        (String) result[0],
                        (String) result[1],
                        ((Number) result[2]).longValue()))
                .collect(Collectors.toList());
    }

    public List<Prov2PrefixStatDTO> getProv2PrefixStats() {
        List<Object[]> results = caseStudyRepository.findProv2PrefixStats();
        return results.stream()
                .map(result -> new Prov2PrefixStatDTO(
                        (String) result[0],
                        ((Number) result[1]).longValue()))
                .collect(Collectors.toList());
    }

    public WeightStatisticsDTO getWeightStatistics() {
        List<Object[]> results = caseStudyRepository.findWeightStatistics();
        if (results.isEmpty()) {
            return new WeightStatisticsDTO(0.0, 0.0, 0.0);
        }
        Object[] result = results.get(0);
        return new WeightStatisticsDTO(
                ((Number) result[0]).doubleValue(),
                ((Number) result[2]).doubleValue(),
                ((Number) result[1]).doubleValue());
    }

    public List<DisembarkationPortStatDTO> getEmbarkationPortFrequency() {
        List<Object[]> results = caseStudyRepository.findDisembarkationPortFrequency();
        return results.stream()
                .map(result -> new DisembarkationPortStatDTO(
                        (String) result[0],
                        ((Number) result[1]).longValue()))
                .collect(Collectors.toList());
    }

}
