package opendata.portal.api.controller;

import opendata.portal.api.model.Activity;
import opendata.portal.api.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/apiV1/activities")
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<Activity>> getAllActivities() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Activity>> getAllActivities(
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        return ResponseEntity.ok(activityService.getAllActivities(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Activity> getActivityById(@PathVariable String id) {
        Activity activity = activityService.getActivityById(id);
        return activity != null ? ResponseEntity.ok(activity) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Activity> createActivity(@RequestBody Activity activity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(activityService.saveActivity(activity));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Activity> updateActivity(@PathVariable String id, @RequestBody Activity activity) {
        // Ensure the ID in the path matches the ID in the body, or set it.
        // For simplicity, this example assumes the ID in the body is used or ignored if
        // not matching.
        // A more robust implementation would handle ID mismatches explicitly.
        Activity existingActivity = activityService.getActivityById(id);
        if (existingActivity == null) {
            return ResponseEntity.notFound().build();
        }
        activity.setId(id); // Ensure the ID is set for the update
        return ResponseEntity.ok(activityService.saveActivity(activity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(@PathVariable String id) {
        Activity existingActivity = activityService.getActivityById(id);
        if (existingActivity == null) {
            return ResponseEntity.notFound().build();
        }
        activityService.deleteActivity(id);
        return ResponseEntity.noContent().build();
    }
}
