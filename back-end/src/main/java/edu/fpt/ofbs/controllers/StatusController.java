package edu.fpt.ofbs.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.fpt.ofbs.entities.Status;
import edu.fpt.ofbs.service.StatusService;

@RestController
@CrossOrigin("*")
@RequestMapping("/status")
public class StatusController {
	@Autowired
	private StatusService statusService;
	
	@GetMapping("/getRestaurantStatus")
	public ResponseEntity<?> getRestaurantStatus() {
		List<Status> status = statusService.getRestaurantStatus();
		
		return ResponseEntity.status(HttpStatus.OK).body(status);
	}
}
