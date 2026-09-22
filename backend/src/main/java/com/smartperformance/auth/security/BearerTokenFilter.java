package com.smartperformance.auth.security;

import com.smartperformance.auth.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
//import java.util.List;

@Component
public class BearerTokenFilter extends OncePerRequestFilter {
    private final TokenService tokenService;
    private final UserRepository userRepository;

    public BearerTokenFilter(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            try {
                String email = tokenService.getEmail(header.substring(7));
                userRepository.findByEmail(email)
                        .filter(u -> u.getIsActive() != null && u.getIsActive() == 1)
                        .ifPresent(u -> SecurityContextHolderHelper.authenticate(u.getEmail()));
            } catch (Exception ignored) {
                // SecurityContext remains empty and Spring Security returns 401 for protected APIs.
            }
        }
        filterChain.doFilter(request, response);
    }
}
