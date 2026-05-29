package com.dmart.clone.service;

import java.util.List;

import com.dmart.clone.dto.AddressDto;
import com.dmart.clone.model.User;

public interface AddressService {

    List<AddressDto> getUserAddresses(User user);

    AddressDto addAddress(User user, AddressDto dto);

    AddressDto updateAddress(User user, Long addressId, AddressDto dto);

    void deleteAddress(User user, Long addressId);
}
