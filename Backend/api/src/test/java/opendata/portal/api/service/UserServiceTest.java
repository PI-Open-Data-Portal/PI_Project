package opendata.portal.api.service;

import opendata.portal.api.model.User;
import opendata.portal.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testRegisterSuccess() {
        String name = "Test User";
        String email = "test@example.com";
        String password = "password";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        User user = userService.register(name, email, password);
        assertEquals(name, user.getName());
        assertEquals(email, user.getEmail());
        assertTrue(passwordEncoder.matches(password, user.getPassword()));
        assertNotNull(user.getPermissions());
    }

    @Test
    void testRegisterEmailExists() {
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(new User()));
        assertThrows(RuntimeException.class, () -> userService.register("a", email, "b"));
    }

    @Test
    void testAuthenticateSuccess() {
        String email = "test@example.com";
        String password = "password";
        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        Optional<User> result = userService.authenticate(email, password);
        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());
    }

    @Test
    void testAuthenticateFail() {
        String email = "test@example.com";
        String password = "password";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        Optional<User> result = userService.authenticate(email, password);
        assertFalse(result.isPresent());
    }

    @Test
    void testGetAllUsers() {
        List<User> users = Arrays.asList(new User(), new User());
        when(userRepository.findAll()).thenReturn(users);
        List<User> result = userService.getAllUsers();
        assertEquals(2, result.size());
    }

    @Test
    void testDeleteUserSuccess() {
        String email = "test@example.com";
        User user = new User();
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        doNothing().when(userRepository).delete(user);
        assertDoesNotThrow(() -> userService.deleteUser(email));
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    void testDeleteUserNotFound() {
        String email = "notfound@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.deleteUser(email));
    }

    @Test
    void testUpdateUserSuccess() {
        String email = "test@example.com";
        String newName = "New Name";
        String newPassword = "newpass";
        User user = new User();
        user.setEmail(email);
        user.setName("Old Name");
        user.setPassword(passwordEncoder.encode("oldpass"));
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        User updated = userService.updateUser(email, newName, newPassword);
        assertEquals(newName, updated.getName());
        assertTrue(passwordEncoder.matches(newPassword, updated.getPassword()));
    }

    @Test
    void testUpdateUserNotFound() {
        String email = "notfound@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());
        assertThrows(RuntimeException.class, () -> userService.updateUser(email, "a", "b"));
    }

    @Test
    void testUpdateUserOnlyName() {
        String email = "test@example.com";
        String newName = "Only Name";
        User user = new User();
        user.setEmail(email);
        user.setName("Old Name");
        user.setPassword(passwordEncoder.encode("oldpass"));
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        User updated = userService.updateUser(email, newName, null);
        assertEquals(newName, updated.getName());
        assertTrue(passwordEncoder.matches("oldpass", updated.getPassword()));
    }

    @Test
    void testUpdateUserOnlyPassword() {
        String email = "test@example.com";
        String newPassword = "newpass";
        User user = new User();
        user.setEmail(email);
        user.setName("Old Name");
        user.setPassword(passwordEncoder.encode("oldpass"));
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        User updated = userService.updateUser(email, null, newPassword);
        assertEquals("Old Name", updated.getName());
        assertTrue(passwordEncoder.matches(newPassword, updated.getPassword()));
    }
}
