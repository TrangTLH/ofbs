package edu.fpt.ofbs.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.DishCombo;

@Repository
public interface DishComboRepository extends JpaRepository<DishCombo, Long>{
	@Query(value = "select id from dish_combo where combo_id = ?1 and dish_id = ?2", nativeQuery = true)
	long getDishComboId(long comboId, long dishId);
}
