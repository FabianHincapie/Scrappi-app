package com.talentotech.scrappi.controller;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.talentotech.scrappi.dto.LoginRequest;
import com.talentotech.scrappi.model.User;
import com.talentotech.scrappi.service.UserService;

@RestController
@RequestMapping("/api/users")

public class UserController {
    private final UserService userService;
    public UserController(UserService userService){
        this.userService = userService;
    }
    @PostMapping
    public ResponseEntity<User> create(@RequestBody User user) { 
        return  ResponseEntity.status(HttpStatus.CREATED)
        .body(userService.crearUsuario(user));
    }

    @GetMapping
    public List<User> findAll(){
        return userService.findAll();
    }
    //READ BY ID
    @GetMapping("/{id}")
    public User findByID(@PathVariable Long id){
        return userService.findById(id)
        .orElseThrow(()-> new ResponseStatusException(
            HttpStatus.NOT_FOUND,
            "Usuario no encontrado"));
    }
    // UPDATE
    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User userDetails){
        
        return userService.update(id, userDetails);

    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String response = userService.login(request);
        return ResponseEntity.ok(response);
    }
    
    
      
    
}

