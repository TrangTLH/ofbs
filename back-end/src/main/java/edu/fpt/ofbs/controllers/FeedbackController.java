package edu.fpt.ofbs.controllers;

import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.fpt.ofbs.entities.Feedback;
import edu.fpt.ofbs.models.FeedbackDTO;
import edu.fpt.ofbs.models.IFeedbackDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.FeedbackService;

@RestController
@CrossOrigin("*")
@RequestMapping("/feedbacks")
public class FeedbackController {
	@Autowired
	private FeedbackService feedbackService;
	
	@GetMapping("/getFeedbacksByRestaurantId")
	public ResponseEntity<?> getFeedbacksByRestaurantId(@PathParam("restaurantId") long restaurantId, @PathParam("rate") float rate) {
		List<IFeedbackDTO> feedbacks = feedbackService.getFeedbackByRestaurantId(restaurantId, rate);
		return ResponseEntity.status(HttpStatus.OK).body(feedbacks);
	}
	
	@PostMapping("/insertFeedback")
	public ResponseEntity<?> insertFeedback(@RequestBody FeedbackDTO feedback) {
		String message = "";
		try {
			feedbackService.save(feedback);

			message = "Insert the feedback successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not insert feedback !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@GetMapping("/getReport")
	public ResponseEntity<?> getReport() {
		List<Feedback> feedbacks = feedbackService.findByRateAndStatus();
		return ResponseEntity.status(HttpStatus.OK).body(feedbacks);
	}
	
	@PatchMapping("/updateStatusFeedback")
	public ResponseEntity<?> updateStatus(@PathParam("feedbackId") long feedbackId) {
		String message = "";
		try {
			feedbackService.updateStatusFeedback(feedbackId);

			message = "Update the feedback successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not update feedback !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
}
