package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.models.IOrderDetailDTO;
import edu.fpt.ofbs.models.OrderDetailSaveDTO;

public interface OrderDetailService {

	void insertOrderDetail(List<OrderDetailSaveDTO> orderDetails);

	void deleteOrderDetail(long orderId);

	List<IOrderDetailDTO> getOrderDetailByOrderId(long orderId, long customerId, long restaurantId);

	List<IOrderDetailDTO> getOrderDetailByOrderCode(String orderCode);

}
