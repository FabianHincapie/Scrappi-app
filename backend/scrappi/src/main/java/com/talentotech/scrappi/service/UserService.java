package com.talentotech.scrappi.service;

import java.util.List;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;
import com.talentotech.scrappi.service.SessionService;
import com.talentotech.scrappi.dto.LoginRequest;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.talentotech.scrappi.model.Session;
import com.talentotech.scrappi.model.SessionStatus;
import com.talentotech.scrappi.dto.LoginRequest;
import com.talentotech.scrappi.exception.ResourceNotFoundException;
import com.talentotech.scrappi.model.User;
import com.talentotech.scrappi.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService {
    private final SessionService sessionService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            SessionService sessionService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessionService = sessionService;
    }

    public User crearUsuario(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User update(long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        // Corregido: Tu modelo usa .setName() en lugar de .setFirstName()
        if (userDetails.getName() != null)
            user.setName(userDetails.getName());
        if (userDetails.getLastName() != null)
            user.setLastName(userDetails.getLastName());

        // Corregido: Actualización de otros campos del modelo
        if (userDetails.getUserName() != null)
            user.setUserName(userDetails.getUserName());
        if (userDetails.getEmail() != null)
            user.setEmail(userDetails.getEmail());
        if (userDetails.getPhone() != null)
            user.setPhone(userDetails.getPhone());
        if (userDetails.getRole() != null)
            user.setRole(userDetails.getRole());

        // Si mandan password nueva, la encriptamos
        if (userDetails.getPassword() != null && !userDetails.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }

        // Corregido: Tu modelo usa .isStatus() / .setStatus()
        user.setStatus(userDetails.isStatus());

        return userRepository.save(user);
    }

    public void delete(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con id: " + id));

        // Corregido: Borrado lógico usando tu variable 'status'
        user.setStatus(false);
        // user.setRole(Role.INACTIVE); // Solo si tienes INACTIVE en tu Enum Role

        userRepository.save(user);
    }

    public String login(LoginRequest request, HttpServletRequest httpRequest) {
        String identifier = request.getIdentifier(); // 👈 Asegúrate que LoginRequest.java tenga 'identifier'

        if (identifier == null || identifier.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El identificador es obligatorio");
        }

        Optional<User> optionalUser;
        try {
            Long doc = Long.parseLong(identifier);
            optionalUser = userRepository.findByDocument(doc);
            if (optionalUser.isEmpty()) {
                optionalUser = userRepository.findByUserName(identifier);
            }
        } catch (NumberFormatException e) {
            optionalUser = userRepository.findByUserName(identifier);
        }

        User user = optionalUser
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario no encontrado"));

        if (!user.isStatus()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario desactivado");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Contraseña incorrecta");
        }

        sessionService.createLoginSession(user.getId(), httpRequest.getRemoteAddr(),
                httpRequest.getHeader("User-Agent"));

        return "Login correcto";
    }

}