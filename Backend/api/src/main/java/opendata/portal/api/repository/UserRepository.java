package opendata.portal.api.repository;

import opendata.portal.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository  extends JpaRepository<User, String> {
    User findByEmail(String email);

    boolean existsByEmail(String email);
}
