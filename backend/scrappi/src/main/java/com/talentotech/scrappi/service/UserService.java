package com.talentotech.scrappi.service;
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.talentotech.scrappi.dto.LoginRequest;
import com.talentotech.scrappi.exception.ResourceNotFoundException;
import com.talentotech.scrappi.model.User;
import com.talentotech.scrappi.repository.UserRepository;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    public UserService(UserRepository userRepository,
    PasswordEncoder passwordEncoder
    ){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
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
        if(userDetails.getUsername()!=null &&
        !userDetails.getUsername().trim().isEmpty()){
        user.setUsername(userDetails.getUsername());
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

    public String login(LoginRequest request){
        Optional<User> optionalUser = userRepository.findByUserName(request.getUsername());
        if(optionalUser.isEmpty()){
            throw new ResourceNotFoundException("usuario no encontrado");
        }
        User user = optionalUser.get();
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword())){
            throw new ResourceNotFoundException("Contraseña incorrecta");
        }
        return "Login correcto";
    }

} 

