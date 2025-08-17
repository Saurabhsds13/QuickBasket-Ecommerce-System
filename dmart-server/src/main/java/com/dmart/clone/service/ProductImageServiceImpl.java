package com.dmart.clone.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.dmart.clone.model.Product;
import com.dmart.clone.model.ProductImage;
import com.dmart.clone.repository.ProductImageRepository;

@Service
public class ProductImageServiceImpl implements ProductImageService {

	private final ProductImageRepository productImageRepository;
	private final StorageService storageService;

	public ProductImageServiceImpl(ProductImageRepository productImageRepository, StorageService storageService) {
		super();
		this.productImageRepository = productImageRepository;
		this.storageService = storageService;
	}

	@Override
	public ProductImage uploadImage(Product product, MultipartFile file, boolean isPrimary) {
		String path = storageService.store(file, "products");

		if (isPrimary) {
			// unset existing primary images
			productImageRepository.findByProduct(product).forEach(img -> {
				img.setIsPrimary(false);
				productImageRepository.save(img);
			});
		}

		ProductImage image = new ProductImage();
		image.setProduct(product);
		image.setImageUrl(path);
		image.setIsPrimary(isPrimary);

		return productImageRepository.save(image);
	}

	@Override
	public List<ProductImage> getImagesByProduct(Product product) {
		return productImageRepository.findByProduct(product);
	}
}
