package com.dmart.clone.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class LocalStorageService implements StorageService {

	@Value("${disk.upload.basepath}")
	private String BASEPATH;

	@Override
	public String store(MultipartFile file, String folder) {

		try {
			String originalName = StringUtils.cleanPath(file.getOriginalFilename());
			String ext = originalName.substring(originalName.lastIndexOf('.'));
			String fileName = UUID.randomUUID().toString() + ext;

			String dirPath = BASEPATH + "/" + folder;
			Files.createDirectories(Paths.get(dirPath));

			file.transferTo(new File(dirPath + "/" + fileName));
			return dirPath + "/" + fileName; // return relative path
		} catch (IOException e) {
			throw new RuntimeException("Failed to store file", e);
		}
	}

	@Override
	public byte[] load(String filePath) {
		try {
			return Files.readAllBytes(Paths.get(filePath));
		} catch (IOException e) {
			throw new RuntimeException("Failed to read file", e);
		}
	}

	@Override
	public List<String> loadAll() {
		File dirPath = new File(BASEPATH);
		return Arrays.asList(dirPath.list());
	}

	@Override
	public void delete(String fileName) {
		File filePath = new File(BASEPATH, fileName);
		if (filePath.exists())
			filePath.delete();
	}
}
