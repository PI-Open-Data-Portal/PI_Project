package opendata.portal.api.service;

import opendata.portal.api.model.Activity;
import opendata.portal.api.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    public Page<Activity> getAllActivities(Pageable pageable) {
        return activityRepository.findAll(pageable);
    }

    public Activity getActivityById(String id) {
        return activityRepository.findById(id).orElse(null);
    }

    public Activity saveActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    public void deleteActivity(String id) {
        activityRepository.deleteById(id);
    }
}
