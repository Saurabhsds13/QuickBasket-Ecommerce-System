package com.dmart.clone.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;

@Service
public class LocalStorageService implements StorageService {

	@Value("${disk.upload.basepath}")
	private String BASEPATH;

	@PostConstruct
	public void init() {
		try {
			Files.createDirectories(Paths.get(BASEPATH));
		} catch (IOException e) {
			throw new RuntimeException("Could not initialize storage", e);
		}
	}

	@Override
	public String store(MultipartFile file, String folder) {
		try {
			String originalName = StringUtils.cleanPath(file.getOriginalFilename());
			String ext = originalName.substring(originalName.lastIndexOf('.'));
			String fileName = UUID.randomUUID() + ext;

			Path dirPath = Paths.get(BASEPATH, folder);
			Files.createDirectories(dirPath);

			file.transferTo(dirPath.resolve(fileName).toFile());

			// return relative URL (for frontend)
			return "/uploads/" + folder + "/" + fileName;

		} catch (IOException e) {
			throw new RuntimeException("Failed to store file", e);
		}
	}

	@Override
	public byte[] load(String fileUrl) {
		try {
			String relativePath = fileUrl.replace("/uploads", "");
			return Files.readAllBytes(Paths.get(BASEPATH, relativePath));
		} catch (IOException e) {
			throw new RuntimeException("Failed to read file", e);
		}
	}

	@Override
	public List<String> loadAll() {
		File dir = new File(BASEPATH);
		if (!dir.exists())
			return List.of();

		return Arrays.stream(dir.listFiles()).filter(File::isFile).map(File::getName).toList();
	}

	@Override
	public void delete(String fileUrl) {
		String relativePath = fileUrl.replace("/uploads", "");
		File filePath = new File(BASEPATH, relativePath);
		if (filePath.exists()) {
			filePath.delete();
		}
	}
}
