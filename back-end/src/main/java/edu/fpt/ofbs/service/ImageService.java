package edu.fpt.ofbs.service;

import java.io.IOException;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import edu.fpt.ofbs.entities.Image;
import edu.fpt.ofbs.models.IImageDTO;

public interface ImageService {

	Image store(MultipartFile file, String userId, String dishId, String serviceId, String comboId, String restaurantId,
			String promotionId, String typeId) throws IOException;

	Image update(MultipartFile file, String imageId) throws IOException;

	void delete(long userId);

	void deleteRestaurantCertificate(long restaurantId);

	Image getImage(String id);

	List<IImageDTO> getImagesByRestaurantId(long restaurantId);

	void deleteImageById(String id);

	List<IImageDTO> getImagesRestaurant(long restaurantId);

}
