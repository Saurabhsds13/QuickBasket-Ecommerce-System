package com.dmart.clone.service;

import com.dmart.clone.dto.JwtResponse;
import com.dmart.clone.dto.LoginRequest;
import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.dto.UserViewDto;

public interface AuthService {
	
	JwtResponse login(LoginRequest req);

	UserViewDto registerUser(RegisterRequest req);

}
