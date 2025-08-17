package com.dmart.clone.security;

import java.security.Key;
import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

	@Value("${app.jwt.secret}")
	private String secret;

	@Value("${app.jwt.expirationMs}")
	private long expirationMs;

	private Key key() {
		return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
	}

	private Key getSigningKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secret); // secret must be Base64 encoded
		return Keys.hmacShaKeyFor(keyBytes);
	}

	public String generateToken(String subject) {
		long now = System.currentTimeMillis();
		return Jwts.builder().setSubject(subject) // ✅ new method (replaces setSubject)
				.setIssuedAt(new Date(now)) // ✅ new method (replaces setIssuedAt)
				.setExpiration(new Date(now + expirationMs)) // ✅ new method (replaces setExpiration)
				.signWith(getSigningKey()) // ✅ no need to pass SignatureAlgorithm explicitly
				.compact();
	}

	public String extractUsername(String token) {
		return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
	}

	public boolean validateToken(String token, String username) {
		String tokenUsername = extractUsername(token);
		return tokenUsername.equals(username) && !isTokenExpired(token);
	}

	private boolean isTokenExpired(String token) {
		return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getExpiration()
				.before(new Date());
	}
}