package opendata.portal.api.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import opendata.portal.api.jwt.JwtUtil;
import opendata.portal.api.model.AuthRequest;
import opendata.portal.api.model.AuthResponse;
import opendata.portal.api.model.User;
import opendata.portal.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/api/v1")
@Tag(name = "UserController", description = "User API")
@RestController
public class UserController {
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private UserService userService;


    @Operation(summary = "Login a user")
    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authenticationRequest) {
        try {

            User user = userService.getUserByEmail(authenticationRequest.getEmail());

            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, "Invalid email or password"));
            }

            if (!passwordEncoder.matches(authenticationRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new AuthResponse(null, "Invalid email or password"));
            }

            String jwt = jwtUtil.generateToken(user.getEmail()); // Gerar o token JWT usando o email

            return ResponseEntity.ok(new AuthResponse(jwt, null)); // Retorna o token JWT
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, "Invalid email or password: " + e.getMessage()));
        }
    }

}
