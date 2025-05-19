package opendata.portal.api.model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

@Entity
public class User {
    // id, name password and array of permissions
    @Id
    private String id;

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
    @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "Name must contain only letters, spaces, hyphens and apostrophes")
    private String name;

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    private  String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;


    @ElementCollection
    private List<String> permissions;

    public User(String id, String name, String email, String password, List<String> permissions) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.permissions = permissions;
    }

    public User() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public @NotBlank(message = "Name is required") @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters") @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "Name must contain only letters, spaces, hyphens and apostrophes") String getName() {
        return name;
    }

    public void setName(@NotBlank(message = "Name is required") @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters") @Pattern(regexp = "^[a-zA-Z\\s-']+$", message = "Name must contain only letters, spaces, hyphens and apostrophes") String name) {
        this.name = name;
    }

    public @NotBlank(message = "Email is required") String getEmail() {
        return email;
    }

    public void setEmail(@NotBlank(message = "Email is required") String email) {
        this.email = email;
    }

    public @NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters") String getPassword() {
        return password;
    }

    public void setPassword(@NotBlank(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters") String password) {
        this.password = password;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<String> permissions) {
        this.permissions = permissions;
    }
}
