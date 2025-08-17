package com.dmart.clone.service;

import com.dmart.clone.dto.RegisterRequest;
import com.dmart.clone.dto.UserViewDto;
import com.dmart.clone.model.User;

import jakarta.servlet.http.HttpServletRequest;

public interface UserService {

	UserViewDto register(RegisterRequest request);

	User getCurrentUser(HttpServletRequest request);

	UserViewDto getUserByUsername(String username);
}
