package edu.fpt.ofbs.controllers;

import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.fpt.ofbs.entities.Promotion;
import edu.fpt.ofbs.models.IPromotionDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.PromotionService;

@RestController
@CrossOrigin("*")
@RequestMapping("/promotions")
public class PromotionController {
	@Autowired
	private PromotionService promotionService;
	
	@GetMapping("/searchPromotionByProvince")
	public ResponseEntity<?> searchPromotionByProvince(@PathParam("province") String province) {
		List<IPromotionDTO> promotions = promotionService.searchPromotionByProvince(province);
		return ResponseEntity.status(HttpStatus.OK).body(promotions);
	}
	
	@GetMapping("/getPromotionsByRestaurantId")
	public ResponseEntity<?> getPromotionsByRestaurantId(@PathParam("restaurantId") long restaurantId, @PathParam("isActive") boolean isActive) {
		List<IPromotionDTO> promotions = promotionService.getPromotionsByRestaurantId(restaurantId, isActive);
		return ResponseEntity.status(HttpStatus.OK).body(promotions);
	}
	
	@GetMapping("/getPromotionById")
	public ResponseEntity<?> getPromotionById(@PathParam("promotionId") long promotionId) {
		Promotion promotion = promotionService.getPromotionById(promotionId);
		return ResponseEntity.status(HttpStatus.OK).body(promotion);
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> updateInforPromotion(@RequestBody Promotion promotion) {
		try {
			promotionService.savePromotion(promotion);

			return ResponseEntity.status(HttpStatus.OK).body(promotion);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage("Update promotion fail !"));
		}
	}
}
