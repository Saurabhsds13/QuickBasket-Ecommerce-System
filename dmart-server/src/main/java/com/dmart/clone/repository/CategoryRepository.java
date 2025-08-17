package com.dmart.clone.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.dmart.clone.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
