package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.models.IOrderDTO;
import edu.fpt.ofbs.models.OrderDTO;

public interface OrderService {

	List<IOrderDTO> getOrderByCustomerId(long customerId, long statusId);

	List<IOrderDTO> getOrderByRestaurantId(long restaurantId, String orderCode);

	void insertOrder(OrderDTO order);

	void deleteOrder(long orderId);

	void setOrderStatus(long customerId, long restaurantId);

	void updateOrderStatus(long orderId, String status);

	int getTotalOrderByStatus(String status, String fromDate, String toDate);

	List<IOrderDTO> getOrders(String orderCode, String fromDate, String toDate, String status);

	long getOrderIdBeforeInsert(long customerId, long restaurantId);

}
