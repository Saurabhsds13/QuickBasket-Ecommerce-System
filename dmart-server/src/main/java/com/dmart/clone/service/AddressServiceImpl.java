package com.dmart.clone.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.dmart.clone.dto.AddressDto;
import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Address;
import com.dmart.clone.model.User;
import com.dmart.clone.repository.AddressRepository;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;

    public AddressServiceImpl(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AddressDto> getUserAddresses(User user) {
        return addressRepository.findByUser(user).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public AddressDto addAddress(User user, AddressDto dto) {
        Address address = new Address();
        address.setUser(user);
        address.setType(dto.type().toUpperCase());
        address.setLine1(dto.line1());
        address.setLine2(dto.line2());
        address.setCity(dto.city());
        address.setState(dto.state());
        address.setPostalCode(dto.postalCode());
        address.setCountry(dto.country());

        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    @Override
    public AddressDto updateAddress(User user, Long addressId, AddressDto dto) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id=" + addressId));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own addresses");
        }

        address.setType(dto.type().toUpperCase());
        address.setLine1(dto.line1());
        address.setLine2(dto.line2());
        address.setCity(dto.city());
        address.setState(dto.state());
        address.setPostalCode(dto.postalCode());
        address.setCountry(dto.country());

        Address saved = addressRepository.save(address);
        return mapToDto(saved);
    }

    @Override
    public void deleteAddress(User user, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id=" + addressId));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own addresses");
        }

        addressRepository.delete(address);
    }

    private AddressDto mapToDto(Address address) {
        return new AddressDto(
                address.getId(),
                address.getType(),
                address.getLine1(),
                address.getLine2(),
                address.getCity(),
                address.getState(),
                address.getPostalCode(),
                address.getCountry()
        );
    }
}
