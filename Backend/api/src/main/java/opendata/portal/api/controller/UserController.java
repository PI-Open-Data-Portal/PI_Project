package opendata.portal.api.controller;

import opendata.portal.api.model.RegisterRequest;
import opendata.portal.api.model.User;
import opendata.portal.api.service.UserService;
import opendata.portal.api.util.JwtUtil;
import opendata.portal.api.model.AuthRequest;
import opendata.portal.api.model.AuthResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/apiV1/auth")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        String name = req.getName();
        String email = req.getEmail();
        String password = req.getPassword();
        logger.info("Register attempt for email: {}", email);
        try {
            userService.register(name, email, password);
            String token = jwtUtil.generateToken(email);
            logger.info("Registration successful for email: {}", email);
            return ResponseEntity.ok(new AuthResponse(token, null));
        } catch (Exception e) {
            logger.error("Registration failed for email: {}: {}", email, e.getMessage());
            return ResponseEntity.badRequest().body(new AuthResponse(null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        String email = req.getEmail();
        String password = req.getPassword();
        logger.info("Login attempt for email: {}", email);
        var userOpt = userService.authenticate(email, password);
        if (userOpt.isPresent()) {
            String token = jwtUtil.generateToken(email);
            logger.info("Login successful for email: {}", email);
            return ResponseEntity.ok(new AuthResponse(token, null));
        } else {
            logger.warn("Login failed for email: {}", email);
            return ResponseEntity.status(401).body(new AuthResponse(null, "Invalid credentials"));
        }
    }
}