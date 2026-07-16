package com.dmart.clone.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.dmart.clone.dto.AddressDto;
import com.dmart.clone.model.User;
import com.dmart.clone.service.AddressService;
import com.dmart.clone.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user/addresses")
public class AddressController {

    private final AddressService addressService;
    private final UserService userService;

    public AddressController(AddressService addressService, UserService userService) {
        this.addressService = addressService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<AddressDto>> getAddresses(HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(addressService.getUserAddresses(user));
    }

    @PostMapping
    public ResponseEntity<AddressDto> addAddress(@RequestBody @Valid AddressDto dto, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(addressService.addAddress(user, dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDto> updateAddress(@PathVariable Long id, @RequestBody @Valid AddressDto dto,
                                                    HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(addressService.updateAddress(user, id, dto));
    }

    @PutMapping("/{id}/default")
    public ResponseEntity<AddressDto> setDefaultAddress(@PathVariable Long id, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        return ResponseEntity.ok(addressService.setDefaultAddress(user, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id, HttpServletRequest request) {
        User user = userService.getCurrentUser(request);
        addressService.deleteAddress(user, id);
        return ResponseEntity.noContent().build();
    }
}
