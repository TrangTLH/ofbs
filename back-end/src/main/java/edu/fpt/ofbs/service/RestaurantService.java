package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.ProviderType;
import edu.fpt.ofbs.entities.Restaurant;
import edu.fpt.ofbs.models.IRestaurantDTO;

public interface RestaurantService {

	List<IRestaurantDTO> getRestaurantsByType(int type);

	List<IRestaurantDTO> searchRestaurants(int type, String province, String district, String restaurantName);

	List<IRestaurantDTO> getRestaurantById(long id);

	Restaurant findRestaurantById(long id);

	List<ProviderType> getProviderType();

	Restaurant addRestaurant(Restaurant restaurant);

	List<IRestaurantDTO> getRestaurantByProviderId(long providerId, long statusId);

	void updateInforRestaurant(Restaurant restaurant);

	List<IRestaurantDTO> adminViewRestaurant(String restaurantName, String status);

	void updateStatusRestaurant(long restaurantId, String status, String statusUpdate);

	String getProviderPhoneLoginFromRestaurantId(long restaurantId);

	int getTotalRestaurantsByStatus(String status);

	long getProviderIdByPhoneNumber(String phoneNumber);

}
