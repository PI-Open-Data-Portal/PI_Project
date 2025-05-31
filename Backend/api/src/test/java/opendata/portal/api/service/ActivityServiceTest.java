package opendata.portal.api.service;

import opendata.portal.api.model.Activity;
import opendata.portal.api.repository.ActivityRepository;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ActivityServiceTest {
    @Mock
    private ActivityRepository activityRepository;

    @InjectMocks
    private ActivityService activityService;

    private Activity activity;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        activity = new Activity();
        activity.setId("1");
        activity.setDescription("desc");
    }

    @Test
    void testGetAllActivities() {
        when(activityRepository.findAll()).thenReturn(Collections.singletonList(activity));
        List<Activity> result = activityService.getAllActivities();
        assertEquals(1, result.size());
    }

    @Test
    void testGetAllActivitiesPageable() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<Activity> page = new PageImpl<>(Collections.singletonList(activity));
        when(activityRepository.findAll(pageable)).thenReturn(page);
        Page<Activity> result = activityService.getAllActivities(pageable);
        assertEquals(1, result.getTotalElements());
    }

    @Test
    void testGetActivityByIdFound() {
        when(activityRepository.findById("1")).thenReturn(Optional.of(activity));
        Activity result = activityService.getActivityById("1");
        assertNotNull(result);
    }

    @Test
    void testGetActivityByIdNotFound() {
        when(activityRepository.findById("2")).thenReturn(Optional.empty());
        Activity result = activityService.getActivityById("2");
        assertNull(result);
    }

    @Test
    void testSaveActivity() {
        when(activityRepository.save(activity)).thenReturn(activity);
        Activity result = activityService.saveActivity(activity);
        assertEquals("1", result.getId());
    }

    @Test
    void testDeleteActivity() {
        doNothing().when(activityRepository).deleteById("1");
        activityService.deleteActivity("1");
        verify(activityRepository, times(1)).deleteById("1");
    }
}
