package com.dmart.clone.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.dmart.clone.model.Address;
import com.dmart.clone.model.User;

@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    List<Address> findByUser(User user);

    List<Address> findByUserAndType(User user, String type);

    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user = :user AND a.isDefault = true")
    void clearDefaultsByUser(@Param("user") User user);
}
