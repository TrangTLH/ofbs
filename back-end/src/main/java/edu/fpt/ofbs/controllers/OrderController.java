package edu.fpt.ofbs.controllers;

import java.util.List;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import edu.fpt.ofbs.models.IOrderDTO;
import edu.fpt.ofbs.models.IOrderDetailDTO;
import edu.fpt.ofbs.models.OrderDetailSaveDTO;
import edu.fpt.ofbs.models.OrderDTO;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.OrderDetailService;
import edu.fpt.ofbs.service.OrderService;

@RestController
@CrossOrigin("*")
@RequestMapping("/orders")
public class OrderController {
	@Autowired
	private OrderService orderService;

	@Autowired
	private OrderDetailService orderDetailService;

	@GetMapping("/customer")
	public ResponseEntity<?> getOrderByCustomerId(@PathParam("customerId") long customerId,
			@PathParam("statusId") long statusId) {
		List<IOrderDTO> orders = orderService.getOrderByCustomerId(customerId, statusId);
		return ResponseEntity.status(HttpStatus.OK).body(orders);
	}

	@GetMapping("/restaurant")
	public ResponseEntity<?> getOrderByRestaurantId(@PathParam("restaurantId") long restaurantId,
			@PathParam("orderCode") String orderCode) {
		List<IOrderDTO> orders = orderService.getOrderByRestaurantId(restaurantId, orderCode);
		return ResponseEntity.status(HttpStatus.OK).body(orders);
	}

	@PostMapping("/insertOrder")
	public ResponseEntity<?> insertOrder(@RequestBody OrderDTO order) {
		String message = "";

		try {
			orderService.insertOrder(order);

			return ResponseEntity.status(HttpStatus.OK).body(order);
		} catch (Exception e) {
			message = "Could not insert order !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@PostMapping("/insertOrderDetail")
	public ResponseEntity<?> insertOrderDetail(@RequestBody List<OrderDetailSaveDTO> orders) {
		String message = "";

		try {
			orderDetailService.insertOrderDetail(orders);

			message = "Insert the order detail successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not insert order detail !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@DeleteMapping("/deleteOrder")
	public ResponseEntity<?> deleteOrder(@PathParam("orderId") long orderId) {
		String message = "";

		try {
			orderService.deleteOrder(orderId);

			message = "Delete the order successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not delete order !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@DeleteMapping("/deleteOrderDetail")
	public ResponseEntity<?> deleteOrderDetail(@PathParam("orderId") long orderId) {
		String message = "";

		try {
			orderDetailService.deleteOrderDetail(orderId);

			message = "Delete the order detail successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not delete order detail !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@PatchMapping("/setStatus")
	public ResponseEntity<?> setOrderStatus(@PathParam("customerId") long customerId,
			@PathParam("restaurantId") long restaurantId) {
		String message = "";

		try {
			orderService.setOrderStatus(customerId, restaurantId);

			message = "Update order status successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not update order status !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@GetMapping("/orderDetail/infor")
	public ResponseEntity<?> getOrderDetailByOrderId(@PathParam("orderId") long orderId,
			@PathParam("customerId") long customerId, @PathParam("restaurantId") long restaurantId) {
		List<IOrderDetailDTO> orders = orderDetailService.getOrderDetailByOrderId(orderId, customerId, restaurantId);
		return ResponseEntity.status(HttpStatus.OK).body(orders);
	}

	@PatchMapping("/updateStatus")
	public ResponseEntity<?> updateOrderStatus(@PathParam("orderId") long orderId, @PathParam("status") String status) {
		String message = "";

		try {
			orderService.updateOrderStatus(orderId, status);

			message = "Update order status successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not update order status !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}

	@GetMapping("/searchOrder")
	public ResponseEntity<?> searchOrder(@PathParam("orderCode") String orderCode) {
		List<IOrderDetailDTO> orders = orderDetailService.getOrderDetailByOrderCode(orderCode);
		return ResponseEntity.status(HttpStatus.OK).body(orders);
	}

	@GetMapping("/getOrders")
	public ResponseEntity<?> getOrders(@PathParam("orderCode") String orderCode, @PathParam("fromDate") String fromDate,
			@PathParam("toDate") String toDate, @PathParam("status") String status) {
		List<IOrderDTO> orders = orderService.getOrders(orderCode, fromDate, toDate, status);
		return ResponseEntity.status(HttpStatus.OK).body(orders);
	}

	@GetMapping("/getTotalOrderByStatus")
	public ResponseEntity<?> getTotalOrderByStatus(@PathParam("status") String status,
			@PathParam("fromDate") String fromDate, @PathParam("toDate") String toDate) {
		int total = orderService.getTotalOrderByStatus(status, fromDate, toDate);
		return ResponseEntity.status(HttpStatus.OK).body(total);
	}
	
	@GetMapping("/getOrderIdBeforeInsert")
	public ResponseEntity<?> getOrderIdBeforeInsert(@PathParam("customerId") long customerId,
			@PathParam("restaurantId") long restaurantId) {
		long orderId = orderService.getOrderIdBeforeInsert(customerId, restaurantId);
		return ResponseEntity.status(HttpStatus.OK).body(orderId);
	}
}
