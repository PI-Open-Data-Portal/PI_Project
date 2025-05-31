package opendata.portal.api.controller;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.ValidationException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

public class GlobalExceptionHandlerTest {
    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    void testHandleDataAccessException() {
        DataAccessException ex = new DataAccessException("DB error") {};
        ResponseEntity<Object> response = handler.handleDataAccessException(ex);
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("Internal error", body.get("error"));
        assertEquals("Server went kaboom", body.get("message"));
    }

    @Test
    void testHandleResponseStatusException() {
        ResponseStatusException ex = new ResponseStatusException(HttpStatus.NOT_FOUND, "Not found");
        ResponseEntity<Object> response = handler.handleResponseStatusException(ex);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("Not found", body.get("error"));
        assertTrue(body.get("message").toString().contains("Not found"));
    }

    @Test
    void testHandleConstraintViolationException() {
        ConstraintViolationException ex = new ConstraintViolationException("Constraint fail", null);
        ResponseEntity<Object> response = handler.handleConstraintViolationException(ex);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("Constraint Violation", body.get("error"));
        assertEquals("Constraint fail", body.get("message"));
    }

    @Test
    void testHandleValidationException() {
        ValidationException ex = new ValidationException("Validation fail");
        ResponseEntity<Object> response = handler.handleValidationException(ex);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        Map<?,?> body = (Map<?,?>) response.getBody();
        assertEquals("Validation Error", body.get("error"));
        assertEquals("Validation fail", body.get("message"));
    }
}
