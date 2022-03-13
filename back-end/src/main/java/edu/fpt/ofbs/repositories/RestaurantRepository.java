package edu.fpt.ofbs.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.Restaurant;
import edu.fpt.ofbs.models.IRestaurantDTO;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long>{
	@Query(value = "exec sp_getRestaurantsByType ?1", nativeQuery = true)
	List<IRestaurantDTO> getRestaurantsByType(int type);
	
	@Query(value = "exec sp_searchRestaurant ?1, ?2, ?3, ?4", nativeQuery = true)
	List<IRestaurantDTO> searchRestaurants(int type, String province, String district, String restaurantName);
	
	@Query(value = "exec sp_getRestaurantById ?1", nativeQuery = true)
	List<IRestaurantDTO> getRestaurantById(long id);
	
	@Query(value = "exec sp_getRestaurantsByProviderId ?1, ?2", nativeQuery = true)
	List<IRestaurantDTO> getRestaurantByProviderId(long providerId, long statusId);
	
	@Query(value = "exec sp_adminViewRestaurant ?1, ?2", nativeQuery = true)
	List<IRestaurantDTO> adminViewRestaurant(String restaurantName, String status);
	
	@Modifying
	@Query(value = "exec sp_updateStatusRestaurant ?1, ?2, ?3", nativeQuery = true)
	void updateStatusRestaurant(long restaurantId, String status, String statusUpdate);
	
	@Query(value = "select u.phone_login\r\n"
			+ "  from provider_restaurants res\r\n"
			+ "  join users u on res.provider_id = u.id\r\n"
			+ "  where res.id = ?1", nativeQuery = true)
	String getProviderPhoneLoginFromRestaurantId(long restaurantId);
	
	@Query(value = "exec sp_getTotalRestaurantsByStatus ?1", nativeQuery = true)
	int getTotalRestaurantsByStatus(String status);
	
	@Query(value = "select res.provider_id\r\n"
			+ "  from provider_restaurants res\r\n"
			+ "  where res.phone_number = ?1\r\n"
			+ "  group by res.provider_id", nativeQuery = true)
	long getProviderIdByPhoneNumber(String phoneNumber);
}
