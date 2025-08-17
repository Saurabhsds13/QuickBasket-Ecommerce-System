package com.dmart.clone.service;

import com.dmart.clone.dto.JwtResponse;
import com.dmart.clone.dto.LoginRequest;
import com.dmart.clone.dto.RegisterRequest;

public interface AuthService {
	
	JwtResponse login(LoginRequest req);

	void register(RegisterRequest req);

}
