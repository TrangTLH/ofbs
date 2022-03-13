package edu.fpt.ofbs.controllers;

import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import edu.fpt.ofbs.entities.Image;
import edu.fpt.ofbs.models.IImageDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.ImageService;

@RestController
@CrossOrigin("*")
@RequestMapping("/images")
public class ImageController {

	@Autowired
	private ImageService imageService;

	@PostMapping("/upload")
	public ResponseEntity<ResponseMessage> uploadFile(@RequestParam("file") MultipartFile file,
			@RequestParam("userId") String userId, @RequestParam("dishId") String dishId,
			@RequestParam("serviceId") String serviceId, @RequestParam("comboId") String comboId,
			@RequestParam("restaurantId") String restaurantId, @RequestParam("promotionId") String promotionId,
			@RequestParam("typeId") String typeId) {
		String message = "";
		try {
			imageService.store(file, userId, dishId, serviceId, comboId, restaurantId, promotionId, typeId);

			message = "Uploaded the image successfully: " + file.getOriginalFilename();
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not upload the image: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@PostMapping("/update")
	public ResponseEntity<ResponseMessage> updateImage(@RequestParam("file") MultipartFile file, @RequestParam("imageId") String imageId) {
		String message = "";
		try {
			imageService.update(file, imageId);

			message = "Update the image successfully: " + file.getOriginalFilename();
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not image the file: " + file.getOriginalFilename() + "!";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<ResponseMessage> deleteImage(@RequestParam("userId") long userId) {
		String message = "";
		try {
			imageService.delete(userId);

			message = "Delete the image successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not delete the image !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@DeleteMapping("/deleteCertificate")
	public ResponseEntity<ResponseMessage> deleteRestaurantCertificate(@RequestParam("restaurantId") long restaurantId) {
		String message = "";
		try {
			imageService.deleteRestaurantCertificate(restaurantId);

			message = "Delete the image certificate successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not delete the image certificate !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@GetMapping("/{id}")
	public ResponseEntity<byte[]> getFile(@PathVariable String id) {
		Image img = imageService.getImage(id);

		return ResponseEntity.ok()
	    		.contentType(MediaType.IMAGE_PNG)
	    		.body(img.getValue());
	}
	
	@GetMapping("/getRestaurantImages")
	public ResponseEntity<?> getImagesByRestaurantId(@PathParam("restaurantId") long restaurantId) {
		List<IImageDTO> images = imageService.getImagesByRestaurantId(restaurantId);
		return ResponseEntity.status(HttpStatus.OK).body(images);
	}
	
	@DeleteMapping("/deleteImageById")
	public ResponseEntity<ResponseMessage> deleteImage(@RequestParam("imageId") String imageId) {
		String message = "";
		try {
			imageService.deleteImageById(imageId);

			message = "Delete the image successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not delete the image !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@GetMapping("/getImagesRestaurant")
	public ResponseEntity<?> getImagesRestaurant(@PathParam("restaurantId") long restaurantId) {
		List<IImageDTO> images = imageService.getImagesRestaurant(restaurantId);
		return ResponseEntity.status(HttpStatus.OK).body(images);
	}
}
