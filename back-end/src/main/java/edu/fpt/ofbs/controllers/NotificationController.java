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

import edu.fpt.ofbs.entities.Notification;
import edu.fpt.ofbs.models.INotificationDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.NotificationService;

@RestController
@CrossOrigin("*")
@RequestMapping("/notifications")
public class NotificationController {
	@Autowired
	private NotificationService notificationService;

	@PostMapping("/insertNotification")
	public ResponseEntity<?> insertNotification(@RequestBody Notification notification) {
		String message = "";
		try {
			notificationService.save(notification);

			message = "Insert the notification successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not insert notification !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@GetMapping("/getNotifications")
	public ResponseEntity<?> getNotifications(@PathParam("customerId") long customerId,
			@PathParam("providerId") long providerId, @PathParam("isAdmin") boolean isAdmin) {
		List<INotificationDTO> notifications = notificationService.getNotifications(customerId, providerId, isAdmin);
		return ResponseEntity.status(HttpStatus.OK).body(notifications);
	}
	
	@GetMapping("/getNotificationById")
	public ResponseEntity<?> getNotificationById(@PathParam("id") long id) {
		Notification notification = notificationService.getNotificationById(id);
		return ResponseEntity.status(HttpStatus.OK).body(notification);
	}
}
