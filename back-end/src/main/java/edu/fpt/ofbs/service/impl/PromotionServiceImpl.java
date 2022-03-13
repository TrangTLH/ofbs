package edu.fpt.ofbs.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import edu.fpt.ofbs.entities.Promotion;
import edu.fpt.ofbs.models.IPromotionDTO;
import edu.fpt.ofbs.repositories.PromotionRepository;
import edu.fpt.ofbs.service.PromotionService;

@Service
@Transactional
@Component
public class PromotionServiceImpl implements PromotionService{
	@Autowired
	private PromotionRepository promotionRepository;
	
	@Override
	public List<IPromotionDTO> searchPromotionByProvince(String province){
		return promotionRepository.searchPromotionByProvince(province);
	}
	
	@Override
	public List<IPromotionDTO> getPromotionsByRestaurantId(long restaurantId, boolean isActive){
		return promotionRepository.getPromotionsByRestaurantId(restaurantId, isActive);
	}
	
	@Override
	public Promotion getPromotionById(long id) {
		return promotionRepository.findById(id).get();
	}
	
	@Override
	public void savePromotion(Promotion promotion) {
		promotionRepository.save(promotion);
	}
	
//	@Scheduled(cron = "0 00 00 * * ?", zone = "GMT+7:00")
	@Override
	@Scheduled(cron = "0 00 0/1 * * ?")
	public void updatePromotionStatus() {
		promotionRepository.updatePromotionStatus();
	}
}
