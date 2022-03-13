package edu.fpt.ofbs.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.fpt.ofbs.entities.ProviderType;
import edu.fpt.ofbs.entities.Restaurant;
import edu.fpt.ofbs.models.IRestaurantDTO;
import edu.fpt.ofbs.repositories.ProviderTypeRepository;
import edu.fpt.ofbs.repositories.RestaurantRepository;
import edu.fpt.ofbs.service.RestaurantService;

@Service
@Transactional
public class RestaurantServiceImpl implements RestaurantService{

	@Autowired
	private RestaurantRepository restaurantRepository;
	
	@Autowired
	private ProviderTypeRepository providerTypeRepository;
	
	@Override
	public List<IRestaurantDTO> getRestaurantsByType(int type){
		return restaurantRepository.getRestaurantsByType(type);
	}
	
	@Override
	public List<IRestaurantDTO> searchRestaurants(int type, String province, String district, String restaurantName){
		return restaurantRepository.searchRestaurants(type, province, district, restaurantName);
	}
	
	@Override
	public List<IRestaurantDTO> getRestaurantById(long id){
		return restaurantRepository.getRestaurantById(id);
	}
	
	@Override
	public Restaurant findRestaurantById(long id) {
		return restaurantRepository.findById(id).get();
	}
	
	@Override
	public List<ProviderType> getProviderType() {
		return providerTypeRepository.findAll();
	}
	
	@Override
	public Restaurant addRestaurant(Restaurant restaurant) {
		return restaurantRepository.save(restaurant);
	}
	
	@Override
	public List<IRestaurantDTO> getRestaurantByProviderId(long providerId, long statusId){
		return restaurantRepository.getRestaurantByProviderId(providerId, statusId);
	}
	
	@Override
	public void updateInforRestaurant(Restaurant restaurant) {
		Restaurant res = new Restaurant(restaurant.getId(), restaurant.getProvider(),
				restaurant.getProvince(), restaurant.getDistrict(), restaurant.getAddress(), 
				restaurant.getPhoneNumber(), findRestaurantById(restaurant.getId()).getBussinessLicenseId(), 
				restaurant.getRestaurantName(), restaurant.getStatus(), restaurant.getDescription(), 
				restaurant.getSize(), restaurant.getProviderType());
		
		restaurantRepository.save(res);
	}
	
	@Override
	public List<IRestaurantDTO> adminViewRestaurant(String restaurantName, String status){
		return restaurantRepository.adminViewRestaurant(restaurantName, status);
	}
	
	@Override
	public void updateStatusRestaurant(long restaurantId, String status, String statusUpdate) {
		restaurantRepository.updateStatusRestaurant(restaurantId, status, statusUpdate);
	}
	
	@Override
	public String getProviderPhoneLoginFromRestaurantId(long restaurantId) {
		return restaurantRepository.getProviderPhoneLoginFromRestaurantId(restaurantId);
	}
	
	@Override
	public int getTotalRestaurantsByStatus(String status) {
		return restaurantRepository.getTotalRestaurantsByStatus(status);
	}
	
	@Override
	public long getProviderIdByPhoneNumber(String phoneNumber) {
		return restaurantRepository.getProviderIdByPhoneNumber(phoneNumber);
	}
}
