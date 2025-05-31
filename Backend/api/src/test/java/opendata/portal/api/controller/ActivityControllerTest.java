package opendata.portal.api.controller;

import opendata.portal.api.model.Activity;
import opendata.portal.api.service.ActivityService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.security.test.context.support.WithMockUser;
import java.util.Arrays;
import java.util.List;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@WebMvcTest(ActivityController.class)
@AutoConfigureMockMvc(addFilters = false)
public class ActivityControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ActivityService activityService;

    private Activity activity;
    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    public void setUp() {
        activity = new Activity();
        activity.setId("1");
        activity.setDescription("Descrição de teste");
        activity.setType("TipoTeste");
        activity.setStartedDate(null);
        activity.setEndDate(null);
        activity.setCreatedEntities(null);
        activity.setEntitiesUsingThisActivity(null);
        activity.setAssociatedAgents(null);
        objectMapper.registerModule(new JavaTimeModule());
    }

    // DTO simples para os testes
    static class ActivityDto {
        public String id;
        public String description;
        public String type;
        public ActivityDto(String id, String description, String type) {
            this.id = id;
            this.description = description;
            this.type = type;
        }
    }

    @Test
    public void testGetAllActivities() throws Exception {
        List<Activity> activities = Arrays.asList(activity);
        when(activityService.getAllActivities()).thenReturn(activities);
        mockMvc.perform(get("/apiV1/activities"))
                .andExpect(status().isOk());
    }

    @Test
    public void testGetActivityById() throws Exception {
        when(activityService.getActivityById("1")).thenReturn(activity);
        mockMvc.perform(get("/apiV1/activities/1"))
                .andExpect(status().isOk());
    }
}
