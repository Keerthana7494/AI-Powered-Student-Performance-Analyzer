package com.smartperformance.auth.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class TokenService {
    private final byte[] secret;
    private final long expirationMs;

    public TokenService(@Value("${app.jwt.secret}") String secret,
                        @Value("${app.jwt.expiration-ms}") long expirationMs) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalArgumentException("JWT secret must be at least 32 characters.");
        }
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationMs = expirationMs;
    }

    public String create(String email) {
        long expiry = System.currentTimeMillis() + expirationMs;
        String payload = email + "|" + expiry;
        String encoded = Base64.getUrlEncoder().withoutPadding()
                .encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        return encoded + "." + sign(encoded);
    }

    public String getEmail(String token) {
        String[] parts = token.split("\\.", 2);
        if (parts.length != 2 || !constantTime(parts[1], sign(parts[0]))) {
            throw new IllegalArgumentException("Invalid authentication token.");
        }
        String payload = new String(Base64.getUrlDecoder().decode(parts[0]), StandardCharsets.UTF_8);
        int separator = payload.lastIndexOf('|');
        if (separator < 1) throw new IllegalArgumentException("Invalid authentication token.");
        long expiry = Long.parseLong(payload.substring(separator + 1));
        if (expiry < System.currentTimeMillis()) throw new IllegalArgumentException("Authentication token expired.");
        return payload.substring(0, separator);
    }

    private String sign(String input) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret, "HmacSHA256"));
            return Base64.getUrlEncoder().withoutPadding().encodeToString(
                    mac.doFinal(input.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to create authentication token.", ex);
        }
    }

    private boolean constantTime(String a, String b) {
        return java.security.MessageDigest.isEqual(
                a.getBytes(StandardCharsets.UTF_8), b.getBytes(StandardCharsets.UTF_8));
    }
}
