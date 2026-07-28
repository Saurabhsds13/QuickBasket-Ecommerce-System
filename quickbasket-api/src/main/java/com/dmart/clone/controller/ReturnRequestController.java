package com.dmart.clone.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.ReturnRequestCreateDto;
import com.dmart.clone.dto.ReturnRequestDto;
import com.dmart.clone.model.User;
import com.dmart.clone.service.ReturnRequestService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user/returns")
public class ReturnRequestController {

    @Autowired
    private ReturnRequestService returnRequestService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<ReturnRequestDto> createReturnRequest(
            @RequestBody @Valid ReturnRequestCreateDto dto,
            HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        ReturnRequestDto result = returnRequestService.createReturnRequest(user, dto);
        return ResponseEntity.ok(result);
    }

    @GetMapping
    public ResponseEntity<List<ReturnRequestDto>> getMyReturnRequests(HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        List<ReturnRequestDto> returns = returnRequestService.getMyReturnRequests(user);
        return ResponseEntity.ok(returns);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ReturnRequestDto> getReturnByOrderId(
            @PathVariable Long orderId,
            HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        ReturnRequestDto result = returnRequestService.getReturnRequestByOrderId(user, orderId);
        return ResponseEntity.ok(result);
    }
}
