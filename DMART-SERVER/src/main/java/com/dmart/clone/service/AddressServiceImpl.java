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

import jakarta.persistence.EntityManager;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final EntityManager entityManager;

    public AddressServiceImpl(AddressRepository addressRepository, EntityManager entityManager) {
        this.addressRepository = addressRepository;
        this.entityManager = entityManager;
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
        address.setPhone(dto.phone());
        address.setLabel(dto.label());

        // If this is the first address or explicitly marked default, make it default
        List<Address> existingAddresses = addressRepository.findByUser(user);
        if (existingAddresses.isEmpty() || Boolean.TRUE.equals(dto.isDefault())) {
            addressRepository.clearDefaultsByUser(user);
            entityManager.flush();
            address.setDefault(true);
        } else {
            address.setDefault(false);
        }

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
        address.setPhone(dto.phone());
        address.setLabel(dto.label());

        // If explicitly setting as default
        if (Boolean.TRUE.equals(dto.isDefault()) && !address.isDefault()) {
            addressRepository.clearDefaultsByUser(user);
            entityManager.flush();
            address.setDefault(true);
        }

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

        boolean wasDefault = address.isDefault();
        addressRepository.delete(address);
        entityManager.flush();

        // If we deleted the default, make the first remaining address the default
        if (wasDefault) {
            List<Address> remaining = addressRepository.findByUser(user);
            if (!remaining.isEmpty()) {
                remaining.get(0).setDefault(true);
                addressRepository.save(remaining.get(0));
            }
        }
    }

    @Override
    public AddressDto setDefaultAddress(User user, Long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found with id=" + addressId));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only modify your own addresses");
        }

        // Clear all existing defaults for this user using bulk update
        addressRepository.clearDefaultsByUser(user);
        entityManager.flush();

        // Refresh the entity to pick up the cleared state from DB
        entityManager.refresh(address);

        // Set the new default
        address.setDefault(true);
        Address saved = addressRepository.save(address);
        return mapToDto(saved);
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
                address.getCountry(),
                address.isDefault(),
                address.getPhone(),
                address.getLabel()
        );
    }
}
