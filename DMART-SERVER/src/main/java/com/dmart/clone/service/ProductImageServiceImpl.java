package com.dmart.clone.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dmart.clone.exception.ResourceNotFoundException;
import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.repository.ProductImageRepository;
import com.dmart.clone.repository.ProductRepository;

import jakarta.transaction.Transactional;

@Service
public class ProductImageServiceImpl implements ProductImageService {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private ProductImageRepository productImageRepository;

	@Autowired
	private StorageService storageService;

	@Override
	@Transactional
	public ProductImage uploadImage(Long productId, MultipartFile file, boolean isPrimary) {
		// ✅ 1. Validate product existence
		Product product = productRepository.findById(productId)
				.orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

		// ✅ 2. Store image file (LocalStorageService handles disk storage)
		String imageUrl = storageService.store(file, "products");

		// ✅ 3. Handle primary image uniqueness
		if (isPrimary) {
			productImageRepository.clearPrimaryForProduct(product.getId());
		}

		// ✅ 4. Save ProductImage metadata in DB
		ProductImage image = new ProductImage();
		image.setProduct(product);
		image.setImageUrl(imageUrl); // e.g. "/uploads/products/uuid_file.png"
		image.setIsPrimary(isPrimary);

		return productImageRepository.save(image);
	}

	@Override
	public void deleteImage(Long imageId) {
		ProductImage image = productImageRepository.findById(imageId)
				.orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));

		// ✅ Delete from disk
		storageService.delete(image.getImageUrl());

		// ✅ Delete from DB
		productImageRepository.delete(image);
	}

	@Override
	@Transactional
	public List<ProductImage> getImagesByProduct(Product product) {
		return productImageRepository.findByProduct(product);
	}
}
