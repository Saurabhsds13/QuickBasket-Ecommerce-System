package com.dmart.clone.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	@Value("${disk.upload.basepath}")
	private String basePath;

	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		// Any URL starting with /uploads/** will be mapped to files in basePath
		registry.addResourceHandler("/uploads/**").addResourceLocations("file:" + basePath + "/");
	}
}
