package com.dmart.clone.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;

public interface ProductImageService {

	ProductImage uploadImage(Long productId, MultipartFile file, boolean isPrimary);

	List<ProductImage> getImagesByProduct(Product product);

	void deleteImage(Long imageId);

}
