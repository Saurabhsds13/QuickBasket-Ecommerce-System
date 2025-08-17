package com.dmart.clone.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
	String store(MultipartFile file, String folder);

	List<String> loadAll();

	byte[] load(String filePath);

	void delete(String fileName);
}
