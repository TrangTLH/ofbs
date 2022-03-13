package edu.fpt.ofbs.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.Image;
import edu.fpt.ofbs.models.IImageDTO;

@Repository
public interface ImageRepository extends JpaRepository<Image, String>{
	@Query(value = "exec sp_getImagesByRestaurantId ?1", nativeQuery = true)
	List<IImageDTO> getImagesByRestaurantId(long restaurantId);
	
	@Modifying
	@Query(value = "delete from Images where user_id = ?1", nativeQuery = true)
	void deleteByUserId(long userId);
	
	@Modifying
	@Query(value = "delete from Images where restaurant_id = ?1 and type_id = 3", nativeQuery = true)
	void deleteRestaurantCertificate(long restaurantId);
	
	@Query(value = "exec sp_getImagesRestaurant ?1", nativeQuery = true)
	List<IImageDTO> getImagesRestaurant(long restaurantId);
}
