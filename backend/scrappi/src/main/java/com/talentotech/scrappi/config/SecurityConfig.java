package com.talentotech.scrappi.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration//Se carga automáticamente al iniciar el app
@EnableMethodSecurity //activa la seguridad por anotaciones en métodos
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder(){//crea un objeto global para encriptar contraseñas
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        http
        .csrf(csrf -> csrf.disable()) // si no se desactiva falla POST/PUT/DELETE
        .authorizeHttpRequests(auth -> auth
        .requestMatchers("/api/users/{id}").permitAll()
         .requestMatchers("/api/users").permitAll()
        .requestMatchers("/api/users/login").permitAll()
        .requestMatchers("/api/workstation").permitAll()
        .requestMatchers("/api/sessions/**").permitAll()
        .requestMatchers("/api/alerts/**").permitAll()
        .requestMatchers("/api/worklogs/**").permitAll()
        .requestMatchers("/api/assignments/**").permitAll()
        .anyRequest().authenticated())
        .formLogin(form -> form.disable())
        .httpBasic(basic -> basic.disable());
        return http.build(); 
          
    }
}

