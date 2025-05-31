package opendata.portal.api.service;

import opendata.portal.api.model.ContainerDetails;
import opendata.portal.api.repository.ContainerDetailsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ContainerDetailsServiceTest {
    @Mock
    private ContainerDetailsRepository containerDetailsRepository;

    @InjectMocks
    private ContainerDetailsService containerDetailsService;

    private ContainerDetails containerDetails;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        containerDetails = mock(ContainerDetails.class); // Usar mock, pois só precisamos do objeto
        when(containerDetails.getCode()).thenReturn("ABC123");
    }

    @Test
    void testGetContainerDetails() {
        when(containerDetailsRepository.findAll()).thenReturn(Collections.singletonList(containerDetails));
        List<ContainerDetails> result = containerDetailsService.getContainerDetails();
        assertEquals(1, result.size());
    }

    @Test
    void testGetContainerDetailsByCode() {
        when(containerDetailsRepository.findByCode("ABC123")).thenReturn(containerDetails);
        ContainerDetails result = containerDetailsService.getContainerDetailsByCode("ABC123");
        assertNotNull(result);
    }

    @Test
    void testGetAllBycreation_date() {
        Pageable pageable = PageRequest.of(0, 10);
        Date date = new Date();
        Page<ContainerDetails> page = new PageImpl<>(Collections.singletonList(containerDetails));
        when(containerDetailsRepository.findAllBycreationDate(pageable, date)).thenReturn(page);
        Page<ContainerDetails> result = containerDetailsService.getAllBycreation_date(pageable, date);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetAllByversion_date() {
        Pageable pageable = PageRequest.of(0, 10);
        Date date = new Date();
        Page<ContainerDetails> page = new PageImpl<>(Collections.singletonList(containerDetails));
        when(containerDetailsRepository.findAllByversionDate(pageable, date)).thenReturn(page);
        Page<ContainerDetails> result = containerDetailsService.getAllByversion_date(pageable, date);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetPaginatedContainerDetails() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<ContainerDetails> page = new PageImpl<>(Collections.singletonList(containerDetails));
        when(containerDetailsRepository.findAll(pageable)).thenReturn(page);
        Page<ContainerDetails> result = containerDetailsService.getPaginatedContainerDetails(pageable);
        assertEquals(1, result.getTotalElements());
    }
}
