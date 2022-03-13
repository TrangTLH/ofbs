package edu.fpt.ofbs.service.impl;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import edu.fpt.ofbs.entities.Image;
import edu.fpt.ofbs.models.IImageDTO;
import edu.fpt.ofbs.repositories.ImageRepository;
import edu.fpt.ofbs.service.ImageService;

@Service
@Transactional
public class ImageServiceImpl implements ImageService{

	@Autowired
	private ImageRepository imageRepository;
	
	@Override
	public Image store(MultipartFile file, String userId, String dishId, String serviceId, String comboId,
			String restaurantId, String promotionId, String typeId) throws IOException{
		
			String fileName = StringUtils.cleanPath(file.getOriginalFilename());
			
		    Image image = new Image(fileName, file.getBytes(), userId, dishId, serviceId, comboId, restaurantId, promotionId, typeId);
		    
			return imageRepository.save(image);
	}
	
	@Override
	public Image update(MultipartFile file, String imageId) throws IOException{
		
			String fileName = StringUtils.cleanPath(file.getOriginalFilename());
			
			Image image = getImage(imageId);
			
		    Image newImage = new Image(fileName, file.getBytes(), image.getUserId(), image.getDishId(), image.getServiceId(), 
		    		image.getComboId(), image.getRestaurantId(), image.getPromotionId(), image.getTypeId());
		   newImage.setId(imageId);
		    
			return imageRepository.save(newImage);
	}
	
	@Override
	public void delete(long userId){
		imageRepository.deleteByUserId(userId);
	}
	
	@Override
	public void deleteRestaurantCertificate(long restaurantId) {
		imageRepository.deleteRestaurantCertificate(restaurantId);
	}

	@Override
	public Image getImage(String id) {
		return imageRepository.findById(id).get();
	}
	
	@Override
	public List<IImageDTO> getImagesByRestaurantId(long restaurantId){
		return imageRepository.getImagesByRestaurantId(restaurantId);
	}
	
	@Override
	public void deleteImageById(String id) {
		imageRepository.deleteById(id);
	}
	
	@Override
	public List<IImageDTO> getImagesRestaurant(long restaurantId){
		return imageRepository.getImagesRestaurant(restaurantId);
	}
}
