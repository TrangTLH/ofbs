package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.Promotion;
import edu.fpt.ofbs.models.IPromotionDTO;

public interface PromotionService {

	List<IPromotionDTO> searchPromotionByProvince(String province);

	List<IPromotionDTO> getPromotionsByRestaurantId(long restaurantId, boolean isActive);

	Promotion getPromotionById(long id);

	void savePromotion(Promotion promotion);

	void updatePromotionStatus();

}
