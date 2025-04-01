package opendata.portal.api.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.data.jpa.domain.Specification;

import opendata.portal.api.repository.CaseStudyRepository;
import opendata.portal.api.model.CaseStudy;
import opendata.portal.api.dto.DisembarkationPortStatDTO;
import opendata.portal.api.dto.NST2007_2PStatDTO;
import opendata.portal.api.dto.PortPairStatDTO;
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

    public Page<CaseStudy> getPaginatedCaseStudies(Pageable pageable,
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations,
            String type) {

        // Validate message if provided
        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }

        // Use Specification to build dynamic query with the same filters
        Specification<CaseStudy> spec = Specification.where(null);

        if (startDate != null) {
            spec = spec.and((root, query, cb) -> cb.greaterThanOrEqualTo(root.get("movementDate"), startDate));
        }

        if (endDate != null) {
            spec = spec.and((root, query, cb) -> cb.lessThanOrEqualTo(root.get("movementDate"), endDate));
        }

        if (isTranshipment != null) {
            String transhipmentValue = isTranshipment ? "S" : "N";
            spec = spec.and((root, query, cb) -> cb.equal(root.get("transhipment"), transhipmentValue));
        }

        if (message != null && !message.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("message"), message));
        }

        if (embarkationLocations != null && !embarkationLocations.isEmpty()) {
            spec = spec.and(
                    (root, query, cb) -> cb.like(root.get("embarkationPort"), "%" + embarkationLocations + "%"));
        }

        if (disembarkationLocations != null && !disembarkationLocations.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("disembarkationPort"),
                    "%" + disembarkationLocations + "%"));
        }
        if (type != null && !type.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(root.get("prov2"), type + "%"));
        }

        return caseStudyRepository.findAll(spec, pageable);
    }

    public List<NST2007_2PStatDTO> getNST2007_2PProductStats(
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations) {

        // Validate message if provided
        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }
        String transhipmentValue = null;
        if (isTranshipment != null) {
            transhipmentValue = isTranshipment ? "S" : "N";
        }
        List<Object[]> results = caseStudyRepository.findNST2007_2PProductStats(
                startDate, endDate, transhipmentValue, message, embarkationLocations, disembarkationLocations);

        return results.stream()
                .map(result -> new NST2007_2PStatDTO(
                        (String) result[0],
                        (String) result[1],
                        ((Number) result[2]).longValue()))
                .collect(Collectors.toList());
    }

    private boolean isValidMessage(String message) {
        Set<String> validMessages = Set.of(
                "ARRIVAL_ANNOUNCEMENT", "ARRIVAL_GUIDE", "DECONSOLIDATION_GUIDE",
                "DEPARTURE_GUIDE", "DISEMBARKATION_REPORT", "EMBARKATION_REPORT",
                "LOAD_INSTRUCTION", "LOAD_REPORT", "UNLOAD_INSTRUCTION", "UNLOAD_REPORT",
                "VERIFIED_WEIGHING");

        return validMessages.contains(message);
    }

    public List<Prov2PrefixStatDTO> getProv2PrefixStats(
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations) {
        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }
        String transhipmentValue = null;
        if (isTranshipment != null) {
            transhipmentValue = isTranshipment ? "S" : "N";
        }
        List<Object[]> results = caseStudyRepository.findProv2PrefixStats(startDate, endDate, transhipmentValue,
                message,
                embarkationLocations, disembarkationLocations);
        return results.stream()
                .map(result -> new Prov2PrefixStatDTO(
                        (String) result[0],
                        ((Number) result[1]).longValue()))
                .collect(Collectors.toList());
    }

    public WeightStatisticsDTO getWeightStatistics(LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations) {
        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }
        String transhipmentValue = null;
        if (isTranshipment != null) {
            transhipmentValue = isTranshipment ? "S" : "N";
        }
        List<Object[]> results = caseStudyRepository.findWeightStatistics(startDate, endDate, transhipmentValue,
                message,
                embarkationLocations, disembarkationLocations);
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

    public List<PortPairStatDTO> getPortPairFrequency(
            LocalDate startDate,
            LocalDate endDate,
            Boolean isTranshipment,
            String message,
            String embarkationLocations,
            String disembarkationLocations) {

        if (message != null && !isValidMessage(message)) {
            throw new IllegalArgumentException("Invalid message type: " + message);
        }
        String transhipmentValue = null;
        if (isTranshipment != null) {
            transhipmentValue = isTranshipment ? "S" : "N";
        }
        List<Object[]> results = caseStudyRepository.findPortPairFrequency(
                startDate, endDate, transhipmentValue, message, embarkationLocations, disembarkationLocations);

        return results.stream()
                .map(result -> new PortPairStatDTO(
                        (String) result[0], // embarkationPort
                        (String) result[1], // disembarkationPort
                        ((Number) result[2]).longValue())) // count
                .collect(Collectors.toList());
    }

}
