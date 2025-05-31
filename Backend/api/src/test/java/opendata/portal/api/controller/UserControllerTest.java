package opendata.portal.api.controller;

import opendata.portal.api.model.AuthRequest;
import opendata.portal.api.model.AuthResponse;
import opendata.portal.api.model.RegisterRequest;
import opendata.portal.api.model.User;
import opendata.portal.api.service.UserService;
import opendata.portal.api.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Optional;
import java.util.Map;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.doThrow;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
@AutoConfigureMockMvc(addFilters = false)
public class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private UserService userService;
    @MockBean
    private JwtUtil jwtUtil;
    @Autowired
    private ObjectMapper objectMapper;

    private RegisterRequest registerRequest;
    private AuthRequest authRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Test User");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("123456");
        authRequest = new AuthRequest();
        authRequest.setEmail("test@example.com");
        authRequest.setPassword("123456");
        user = new User();
        user.setId(1L);
        user.setName("Test User");
        user.setEmail("test@example.com");
        user.setPassword("123456");
    }

    @Test
    void testRegisterSuccess() throws Exception {
        when(userService.register(any(), any(), any())).thenReturn(user);
        when(jwtUtil.generateToken(any())).thenReturn("token");
        mockMvc.perform(post("/apiV1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").value("token"));
    }

    @Test
    void testRegisterError() throws Exception {
        when(userService.register(any(), any(), any())).thenThrow(new RuntimeException("Registration error"));
        mockMvc.perform(post("/apiV1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Registration error"));
    }

    @Test
    void testLoginSuccess() throws Exception {
        when(userService.authenticate(any(), any())).thenReturn(Optional.of(user));
        when(jwtUtil.generateToken(any())).thenReturn("token");
        mockMvc.perform(post("/apiV1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.jwt").value("token"));
    }

    @Test
    void testLoginError() throws Exception {
        when(userService.authenticate(any(), any())).thenReturn(Optional.empty());
        mockMvc.perform(post("/apiV1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Invalid credentials"));
    }

    @Test
    void testGetAllUsersSuccess() throws Exception {
        when(userService.getAllUsers()).thenReturn(List.of(user));
        mockMvc.perform(get("/apiV1/auth/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].email").value("test@example.com"));
    }

    @Test
    void testGetAllUsersError() throws Exception {
        when(userService.getAllUsers()).thenThrow(new RuntimeException("DB error"));
        mockMvc.perform(get("/apiV1/auth/users"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("DB error"));
    }

    @Test
    void testDeleteUserSuccess() throws Exception {
        mockMvc.perform(delete("/apiV1/auth/users/test@example.com"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User deleted successfully"));
    }

    @Test
    void testDeleteUserError() throws Exception {
        doThrow(new RuntimeException("Delete error")).when(userService).deleteUser(eq("test@example.com"));
        mockMvc.perform(delete("/apiV1/auth/users/test@example.com"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Delete error"));
    }

    @Test
    void testUpdateUserSuccess() throws Exception {
        when(userService.updateUser(eq("test@example.com"), any(), any())).thenReturn(user);
        mockMvc.perform(put("/apiV1/auth/users/test@example.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("name", "Test User", "password", "123456"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User updated successfully"))
                .andExpect(jsonPath("$.user.email").value("test@example.com"));
    }

    @Test
    void testUpdateUserError() throws Exception {
        when(userService.updateUser(eq("test@example.com"), any(), any())).thenThrow(new RuntimeException("Update error"));
        mockMvc.perform(put("/apiV1/auth/users/test@example.com")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(Map.of("name", "Test User", "password", "123456"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Update error"));
    }
}
