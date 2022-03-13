package edu.fpt.ofbs.controllers;

import java.io.IOException;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.fpt.ofbs.entities.PaymentHistory;
import edu.fpt.ofbs.models.IPaymentHistoryDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.PaymentHistoryService;

@RestController
@CrossOrigin("*")
@RequestMapping("/payment")
public class PaymentController {

	@Autowired
	private PaymentHistoryService paymentHistoryService;


	@GetMapping("/history")
	public ResponseEntity<?> getPaymentHistory(@RequestParam("userId") long userId,
			@RequestParam("paymentCode") String paymentCode, @RequestParam("status") String status,
			@RequestParam("fromDate") String fromDate, @RequestParam("toDate") String toDate, @RequestParam("paymentType") String paymentType) {
		List<IPaymentHistoryDTO> payments = paymentHistoryService.getPaymentHistory(userId, paymentCode, status, fromDate, toDate, paymentType);
		
		return ResponseEntity.status(HttpStatus.OK).body(payments);
	}
	
	@PatchMapping("/updateStatus")
	public ResponseEntity<?> updateOrderStatus(@PathParam("paymentId") long paymentId, @PathParam("status") String status) {
		String message = "";

		try {
			paymentHistoryService.updatePaymentStatus(paymentId, status);

			message = "Update payment status successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not update payment status !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@PostMapping("/save")
	public ResponseEntity<?> save(@RequestBody PaymentHistory paymentHistory) {
		String message = "";

		try {
			PaymentHistory pHistory = paymentHistoryService.save(paymentHistory);
			
			return ResponseEntity.status(HttpStatus.OK).body(pHistory);
		} catch (Exception e) {
			message = "Could not save payment history !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@GetMapping("/getPaymentById")
	public ResponseEntity<?> findById(@PathParam("paymentId") long paymentId) throws IOException {
		PaymentHistory pHistory = paymentHistoryService.findById(paymentId);
		
		return ResponseEntity.status(HttpStatus.OK).body(pHistory);
	}
}
