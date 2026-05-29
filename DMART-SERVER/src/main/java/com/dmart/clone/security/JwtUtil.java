package com.dmart.clone.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
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

//	public String generateToken(String username, String role) {
//
//		Map<String, Object> claims = new HashMap<>();
//		claims.put("role", role);
//		long now = System.currentTimeMillis();
//
//		return Jwts.builder().setSubject(username).setClaims(claims).setIssuedAt(new Date(now))
//				.setExpiration(new Date(now + expirationMs)).signWith(getSigningKey()).compact();
//	}

	public String generateToken(String username, String role) {
		return Jwts.builder()
				.setSubject(username) // 👈 important
				.claim("role", role)
				.setIssuedAt(new Date(System.currentTimeMillis()))
				.setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 15))
				.signWith(key(), SignatureAlgorithm.HS256).compact();
	}

	public String extractUsername(String token) {
		return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody().getSubject();
	}

	public String extractRole(String token) {
		Object role = extractAllClaims(token).get("role");
		return role != null ? role.toString() : null;
	}

	public boolean validateToken(String token, UserDetails userDetails) {
		final String username = extractUsername(token);
		return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
	}

	public boolean isTokenExpired(String token) {
		Date exp = extractExpiration(token);
		return exp == null || exp.before(new Date());
	}

	public Date extractExpiration(String token) {
		return extractAllClaims(token).getExpiration();
	}

	private Claims extractAllClaims(String token) {
		return Jwts.parserBuilder().setSigningKey(key()).build().parseClaimsJws(token).getBody();
	}
}