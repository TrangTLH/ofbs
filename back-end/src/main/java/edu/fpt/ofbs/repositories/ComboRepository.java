package edu.fpt.ofbs.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.Combo;
import edu.fpt.ofbs.models.IComboDTO;

@Repository
public interface ComboRepository extends JpaRepository<Combo, Long>{
	@Query(value = "exec sp_getCombosByRestaurantId ?1, ?2", nativeQuery = true)
	List<IComboDTO> getCombosByRestaurantId(long restaurantId, boolean isActive);
	
	@Modifying
	@Query(value = "UPDATE combos SET status_id = ?1 WHERE id = ?2", nativeQuery = true)
	void updateStatus(long statusId, long comboId);
	
	@Query(value = "exec sp_checkCombo ?1", nativeQuery = true)
	int checkCombo(long comboId);
}
