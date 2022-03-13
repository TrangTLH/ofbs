package edu.fpt.ofbs.service.impl;

import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.fpt.ofbs.models.IOrderDTO;
import edu.fpt.ofbs.models.OrderDTO;
import edu.fpt.ofbs.repositories.OrderRepository;
import edu.fpt.ofbs.service.OrderService;

@Service
@Transactional
public class OrderServiceImpl implements OrderService{
	@Autowired
	private OrderRepository orderRepository;
	
	@Override
	public List<IOrderDTO> getOrderByCustomerId (long customerId, long statusId){
		return orderRepository.getOrderByCustomerId(customerId, statusId);
	}
	
	@Override
	public List<IOrderDTO> getOrderByRestaurantId (long restaurantId, String orderCode){
		return orderRepository.getOrderByRestaurantId(restaurantId, orderCode);
	}
	
	@Override
	public void insertOrder(OrderDTO order) {
		Date orderDate = new Date();
		
		order.setOrderCode("FBS" + order.getCustomerId() + order.getRestaurantId() + "OD" + orderDate.getTime());
		
		orderRepository.insertOrder(order.getTime(), orderDate, order.getCustomerId(), order.getRestaurantId(), order.getTableType(), order.getNumberOfGuests(), order.getNote(), 
				order.getOrganizeDate(), order.getOrderCode(), order.getOrganizeAddress(), order.getOrganizeWard(), order.getOrganizeDistrict(), order.getOrganizeProvince());
	}
	
	@Override
	public void deleteOrder(long orderId) {
		orderRepository.deleteById(orderId);
	}
	
	@Override
	public void setOrderStatus(long customerId, long restaurantId) {
		orderRepository.setOrderStatus(customerId, restaurantId);
	}
	
	@Override
	public void updateOrderStatus(long orderId, String status) {
		orderRepository.updateOrderStatus(orderId, status);
	}
	
	@Override
	public int getTotalOrderByStatus(String status, String fromDate, String toDate) {
		return orderRepository.getTotalOrderByStatus(status, fromDate, toDate);
	}
	
	@Override
	public List<IOrderDTO> getOrders(String orderCode, String fromDate, String toDate, String status){
		return orderRepository.getOrders(orderCode, fromDate, toDate, status);
	}
	
	@Override
	public long getOrderIdBeforeInsert(long customerId, long restaurantId) {
		return orderRepository.getOrderIdBeforeInsert(customerId, restaurantId);
	}
}
