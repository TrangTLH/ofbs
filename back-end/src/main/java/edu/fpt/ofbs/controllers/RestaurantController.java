package edu.fpt.ofbs.controllers;

import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.fpt.ofbs.entities.ProviderType;
import edu.fpt.ofbs.entities.Restaurant;
import edu.fpt.ofbs.models.IRestaurantDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.RestaurantService;
import edu.fpt.ofbs.service.StatusService;

@RestController
@CrossOrigin("*")
@RequestMapping("/restaurants")
public class RestaurantController {
	@Autowired
	private RestaurantService restaurantService;

	@Autowired
	private StatusService statusService;

	@GetMapping("/{type}")
	public ResponseEntity<?> getRestaurantsByType(@PathVariable("type") int type) {
		List<IRestaurantDTO> restaurants = restaurantService.getRestaurantsByType(type);
		return ResponseEntity.status(HttpStatus.OK).body(restaurants);
	}

	@GetMapping("")
	public ResponseEntity<?> searchRestaurants(@PathParam("type") int type, @PathParam("province") String province,
			@PathParam("district") String district, @PathParam("restaurantName") String restaurantName) {
		List<IRestaurantDTO> restaurants = restaurantService.searchRestaurants(type, province, district,
				restaurantName);
		return ResponseEntity.status(HttpStatus.OK).body(restaurants);
	}

	@GetMapping("/detail")
	public ResponseEntity<?> getRestaurantById(@PathParam("restaurantId") long restaurantId) {
		List<IRestaurantDTO> restaurants = restaurantService.getRestaurantById(restaurantId);
		return ResponseEntity.status(HttpStatus.OK).body(restaurants);
	}

	@GetMapping("/providerTypes")
	public ResponseEntity<?> getProviderTypes() {
		List<ProviderType> providerTypes = restaurantService.getProviderType();
		return ResponseEntity.status(HttpStatus.OK).body(providerTypes);
	}

	@PostMapping("/registerRestaurant")
	public ResponseEntity<?> addRestaurant(@RequestBody Restaurant restaurant) {
		restaurant.setStatus(statusService.findStatusByName("pending"));
		try {
			restaurantService.addRestaurant(restaurant);

			return ResponseEntity.status(HttpStatus.OK).body(restaurant);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage("Register fail !"));
		}

	}

	@GetMapping("/getRestaurantByProviderId")
	public ResponseEntity<?> getRestaurantByProviderId(@PathParam("providerId") long providerId,
			@PathParam("statusId") long statusId) {
		List<IRestaurantDTO> restaurant = restaurantService.getRestaurantByProviderId(providerId, statusId);
		return ResponseEntity.status(HttpStatus.OK).body(restaurant);
	}

	@GetMapping("/getRestaurantById")
	public ResponseEntity<?> findRestaurantById(@PathParam("restaurantId") long restaurantId) {
		Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
		return ResponseEntity.status(HttpStatus.OK).body(restaurant);
	}

	@PostMapping("/updateInforRestaurant")
	public ResponseEntity<?> updateInforRestaurant(@RequestBody Restaurant restaurant) {
		try {
			restaurantService.updateInforRestaurant(restaurant);

			return ResponseEntity.status(HttpStatus.OK).body(restaurant);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage("Update restaurant fail !"));
		}
	}

	@GetMapping("/adminViewRestaurant")
	public ResponseEntity<?> adminViewRestaurant(@PathParam("restaurantName") String restaurantName, @PathParam("status") String status) {
		List<IRestaurantDTO> restaurants = restaurantService.adminViewRestaurant(restaurantName, status);
		return ResponseEntity.status(HttpStatus.OK).body(restaurants);
	}

	@PatchMapping("/updateStatus")
	public ResponseEntity<?> updateStatusRestaurant(@PathParam("restaurantId") long restaurantId,
			@PathParam("status") String status, @PathParam("statusUpdate") String statusUpdate) {
		String message = "";

		try {
			restaurantService.updateStatusRestaurant(restaurantId, status, statusUpdate);

			message = "Update restaurant status successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not update restaurant status !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@GetMapping("/getProviderPhoneLogin")
	public ResponseEntity<?> getProviderPhoneLogin(@PathParam("restaurantId") long restaurantId) {
		String phoneLogin = restaurantService.getProviderPhoneLoginFromRestaurantId(restaurantId);
		return ResponseEntity.status(HttpStatus.OK).body(phoneLogin);
	}
	
	@GetMapping("/getTotalRestaurantsByStatus")
	public ResponseEntity<?> getTotalRestaurantsByStatus(@PathParam("status") String status) {
		int numberOfRestaurants = restaurantService.getTotalRestaurantsByStatus(status);
		return ResponseEntity.status(HttpStatus.OK).body(numberOfRestaurants);
	}
	
	@GetMapping("/getProviderIdByPhoneNumber/{phoneNumber}")
	public ResponseEntity<?> getProviderIdByPhoneNumber(@PathVariable("phoneNumber") String phoneNumber) {
		long providerId = restaurantService.getProviderIdByPhoneNumber(phoneNumber);
		return ResponseEntity.status(HttpStatus.OK).body(providerId);
	}
}
