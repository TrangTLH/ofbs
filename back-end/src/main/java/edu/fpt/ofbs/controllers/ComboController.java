package edu.fpt.ofbs.controllers;

import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.fpt.ofbs.entities.Combo;
import edu.fpt.ofbs.models.IComboDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.ComboService;

@RestController
@CrossOrigin("*")
@RequestMapping("/combos")
public class ComboController {
	@Autowired
	private ComboService comboService;
	
	@GetMapping("/getCombosByRestaurantId")
	public ResponseEntity<?> getCombosByRestaurantId(@PathParam("restaurantId") long restaurantId, @PathParam("isActive") boolean isActive) {
		List<IComboDTO> combos = comboService.getCombosByRestaurantId(restaurantId, isActive);
		return ResponseEntity.status(HttpStatus.OK).body(combos);
	}
	
	@GetMapping("/getComboById")
	public ResponseEntity<?> getComboById(@PathParam("comboId") long comboId) {
		Combo combo = comboService.getComboById(comboId);
		return ResponseEntity.status(HttpStatus.OK).body(combo);
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> addCombo(@RequestBody Combo combo) {
		try {
			comboService.saveCombo(combo);

			return ResponseEntity.status(HttpStatus.OK).body(combo);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage("Update combo fail !"));
		}
	}
	
	@PostMapping("/updateStatus")
	public ResponseEntity<?> updateStatus(@PathParam("comboId") long comboId) {
		try {
			comboService.updateStatus(comboId);

			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage("Update status successful !"));
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED)
					.body(new ResponseMessage("Update status fail !"));
		}
	}
	
	@GetMapping("/checkCombo")
	public ResponseEntity<?> checkCombo(@PathParam("comboId") long comboId) {
		int checkCombo = comboService.checkCombo(comboId);
		return ResponseEntity.status(HttpStatus.OK).body(checkCombo);
	}
}
