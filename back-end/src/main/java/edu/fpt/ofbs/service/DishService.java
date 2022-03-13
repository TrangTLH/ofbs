package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.Dish;
import edu.fpt.ofbs.entities.DishCombo;
import edu.fpt.ofbs.entities.MenuCategory;
import edu.fpt.ofbs.models.IDishDTO;

public interface DishService {

	List<IDishDTO> getDishesByComboId(long comboId);

	List<IDishDTO> getDishesByRestaurantId(long restaurantId, long categoryId, String dishName, long statusId);

	Dish getDishById(long id);

	void saveDish(Dish dish);

	void updateStatus(long dishId);

	List<MenuCategory> getAllMenuCategories();

	void addDishCombo(DishCombo dishCombo);

	void removeDishCombo(long comboId, long dishId);

}
