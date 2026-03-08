package com.talentotech.scrappi.service;
import java.util.List;
import java.util.Optional;
import jakarta.servlet.http.HttpServletRequest;
import com.talentotech.scrappi.service.SessionService;
import com.talentotech.scrappi.dto.LoginRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
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
    PasswordEncoder passwordEncoder, SessionService sessionService
    ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessionService = sessionService;
    }
    public User crearUsuario(User user){
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    public List<User> findAll(){
        return userRepository.findAll();
    }
    public Optional<User> findById(Long id){
        return userRepository.findById(id);
    }

    public User update(long id, User userDetails){
        User user = userRepository.findById(id)
        .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if(userDetails.getUserName()!=null &&
        !userDetails.getUserName().trim().isEmpty()){
        user.setUserName(userDetails.getUserName());
        }
          if(userDetails.getEmail()!=null &&
        !userDetails.getEmail().trim().isEmpty()){
          user.setEmail(userDetails.getEmail());
        }
         if(userDetails.getPassword()!=null &&
        !userDetails.getPassword().trim().isEmpty()){
          user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
            
        if(userDetails.getRole()!=null)
            user.setRole(userDetails.getRole());
        
        return userRepository.save(user);
    }

    public String login(LoginRequest request, HttpServletRequest httpRequest){
        Optional<User> optionalUser = userRepository.findByUserName(request.getUsername());
        if(optionalUser.isEmpty()){
            throw new ResourceNotFoundException("usuario no encontrado");
        }
        User user = optionalUser.get();
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new ResourceNotFoundException("Contraseña incorrecta");
        }

        String ip = httpRequest.getRemoteAddr();
        String device = httpRequest.getHeader("User-Agent");
    
        sessionService.createLoginSession(user.getId(), ip, device);
        return "Login correcto";
    }

} 

