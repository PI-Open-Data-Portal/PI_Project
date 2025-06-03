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
import java.util.List;
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

 @GetMapping("/users")
public ResponseEntity<?> getAllUsers() {
logger.info("Request to get all users");
try {
List<User> users = userService.getAllUsers();
logger.info("Retrieved {} users", users.size());
return ResponseEntity.ok(users);
 } catch (Exception e) {
logger.error("Error retrieving users: {}", e.getMessage());
Map<String, String> error = new HashMap<>();
error.put("error", e.getMessage());
return ResponseEntity.badRequest().body(error);
 }
 }

 @DeleteMapping("/users/{email}")
public ResponseEntity<?> deleteUser(@PathVariable String email) {
 logger.info("Request to delete user with email: {}", email);
 try {
     userService.deleteUser(email);
     logger.info("User with email {} deleted successfully", email);
     Map<String, String> response = new HashMap<>();
     response.put("message", "User deleted successfully");
     return ResponseEntity.ok(response);
 } catch (Exception e) {
     logger.error("Error deleting user with email {}: {}", email, e.getMessage());
     Map<String, String> error = new HashMap<>();
     error.put("error", e.getMessage());
     return ResponseEntity.badRequest().body(error);
 }
 }

 @PutMapping("/users/{email}")
public ResponseEntity<?> updateUser(@PathVariable String email, @RequestBody Map<String, String> userData) {
 logger.info("Request to update user with email: {}", email);
 try {
     String name = userData.get("name");
     String password = userData.get("password");
     User updatedUser = userService.updateUser(email, name, password);
     logger.info("User with email {} updated successfully", email);
     Map<String, Object> response = new HashMap<>();
     response.put("message", "User updated successfully");
     response.put("user", Map.of(
         "name", updatedUser.getName(),
         "email", updatedUser.getEmail()
     ));
     return ResponseEntity.ok(response);
 } catch (Exception e) {
     logger.error("Error updating user with email {}: {}", email, e.getMessage());
     Map<String, String> error = new HashMap<>();
     error.put("error", e.getMessage());
     return ResponseEntity.badRequest().body(error);
 }
 }
}