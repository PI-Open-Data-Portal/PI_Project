package opendata.portal.api.service;
import opendata.portal.api.model.User;
import opendata.portal.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
@Service
public class UserService {
 @Autowired
private UserRepository userRepository;
private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

public User register(String name, String email, String password) {
if (userRepository.findByEmail(email).isPresent()) {
throw new RuntimeException("Email already exists");
 }
User user = new User();
user.setName(name);
user.setEmail(email);
user.setPassword(passwordEncoder.encode(password));
user.setPermissions(new java.util.ArrayList<>());
return userRepository.save(user);
 }

public Optional<User> authenticate(String email, String password) {
Optional<User> userOpt = userRepository.findByEmail(email);
if (userOpt.isPresent() && passwordEncoder.matches(password, userOpt.get().getPassword())) {
return userOpt;
 }
return Optional.empty();
 }

public List<User> getAllUsers() {
return userRepository.findAll();
 }

public void deleteUser(String email) {
    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isPresent()) {
        userRepository.delete(userOpt.get());
    } else {
        throw new RuntimeException("User not found");
    }
}

public User updateUser(String email, String name, String password) {
    Optional<User> userOpt = userRepository.findByEmail(email);
    if (userOpt.isPresent()) {
        User user = userOpt.get();
        if (name != null && !name.isEmpty()) {
            user.setName(name);
        }
        if (password != null && !password.isEmpty()) {
            user.setPassword(passwordEncoder.encode(password));
        }
        return userRepository.save(user);
    } else {
        throw new RuntimeException("User not found");
    }
}
}