package opendata.portal.api.service;

import opendata.portal.api.model.User;
import opendata.portal.api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    public boolean existsByEmail(String email) {
        logger.info("Checking if user exists by email: {}", email);
        return userRepository.existsByEmail(email);
    }

    public void saveUser(User user) {
        logger.info("Saving user: {}", user);
        userRepository.save(user);
    }

    public List<String> getPermissions(String email) {
        logger.info("Getting permissions for user: {}", email);
        User user = userRepository.findByEmail(email);
        if (user != null) {
            return user.getPermissions();
        }
        return null;
    }

    public User getUserByEmail(String email) {
        logger.info("Getting user by email: {}", email);
        return userRepository.findByEmail(email);
    }

    public User getUserById(String id) {
        logger.info("Getting user by id: {}", id);
        return userRepository.findById(id).orElse(null);
    }

    public void deleteUser(String id) {
        logger.info("Deleting user by id: {}", id);
        userRepository.deleteById(id);
    }

    public void updateUser(User user) {
        logger.info("Updating user: {}", user);
        userRepository.save(user);
    }

    public void addPermission(String email, String permission) {
        logger.info("Adding permission: {} to user: {}", permission, email);
        User user = userRepository.findByEmail(email);
        if (user != null) {
            List<String> permissions = user.getPermissions();
            permissions.add(permission);
            user.setPermissions(permissions);
            userRepository.save(user);
        }
        else {
            logger.warn("User not found with email: {}", email);
        }



}
    public void removePermission(String email, String permission) {
        logger.info("Removing permission: {} from user: {}", permission, email);
        User user = userRepository.findByEmail(email);
        if (user != null) {
            List<String> permissions = user.getPermissions();
            permissions.remove(permission);
            user.setPermissions(permissions);
            userRepository.save(user);
        }
        else {
            logger.warn("User not found with email: {}", email);
        }
    }
}
