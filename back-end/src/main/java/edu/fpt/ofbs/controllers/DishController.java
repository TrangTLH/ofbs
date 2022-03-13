package edu.fpt.ofbs.controllers;

import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.fpt.ofbs.entities.Dish;
import edu.fpt.ofbs.entities.DishCombo;
import edu.fpt.ofbs.entities.MenuCategory;
import edu.fpt.ofbs.models.IDishDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.DishService;

@RestController
@CrossOrigin("*")
@RequestMapping("/dishes")
public class DishController {
	@Autowired
	private DishService dishService;

	@GetMapping("/getDishesByRestaurantId")
	public ResponseEntity<?> getDishesByRestaurantId(@PathParam("restaurantId") long restaurantId,
			@PathParam("categoryId") long categoryId, @PathParam("dishName") String dishName,
			@PathParam("statusId") long statusId) {
		List<IDishDTO> dishes = dishService.getDishesByRestaurantId(restaurantId, categoryId, dishName, statusId);

		return ResponseEntity.status(HttpStatus.OK).body(dishes);
	}

	@GetMapping("/getDishesByComboId")
	public ResponseEntity<?> getDishesByComboId(@PathParam("comboId") long comboId) {
		List<IDishDTO> dishes = dishService.getDishesByComboId(comboId);

		return ResponseEntity.status(HttpStatus.OK).body(dishes);
	}

	@GetMapping("/getDishesById")
	public ResponseEntity<?> getDishById(@PathParam("dishId") long dishId) {
		Dish dish = dishService.getDishById(dishId);

		return ResponseEntity.status(HttpStatus.OK).body(dish);
	}

	@GetMapping("/getCategories")
	public ResponseEntity<?> getCategories() {
		List<MenuCategory> categories = dishService.getAllMenuCategories();

		return ResponseEntity.status(HttpStatus.OK).body(categories);
	}

	@PostMapping("/save")
	public ResponseEntity<?> updateInforDish(@RequestBody Dish dish) {
		try {
			dishService.saveDish(dish);

			return ResponseEntity.status(HttpStatus.OK).body(dish);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage("Update dish fail !"));
		}
	}

	@PostMapping("/updateStatus")
	public ResponseEntity<?> updateStatus(@PathParam("dishId") long dishId) {
		try {
			dishService.updateStatus(dishId);

			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage("Update status successful !"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage("Update status fail !"));
		}
	}

	@PostMapping("/addDishToCombo")
	public ResponseEntity<?> addDishCombo(@RequestBody DishCombo dishCombo) {
		try {
			dishService.addDishCombo(dishCombo);

			return ResponseEntity.status(HttpStatus.OK).body(dishCombo);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage("Add dish to combo fail !"));
		}
	}

	@DeleteMapping("/removeDishFromCombo")
	public ResponseEntity<?> removeDishCombo(@RequestParam("comboId") long comboId,
			@RequestParam("dishId") long dishId) {
		try {
			dishService.removeDishCombo(comboId, dishId);

			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage("Remove dish from combo sucessful !"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage("Remove dish from combo fail !"));
		}
	}
}
