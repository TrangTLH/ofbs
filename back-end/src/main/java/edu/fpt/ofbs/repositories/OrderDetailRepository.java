package edu.fpt.ofbs.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.OrderDetail;
import edu.fpt.ofbs.models.IOrderDetailDTO;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long>{
	@Modifying
	@Query(value = "exec sp_insertOrderDetail ?1, ?2, ?3, ?4, ?5, ?6", nativeQuery = true)
	void insertOrderDetail(int quantity, long dishId, long comboId, long serviceId, long customerId, long restaurantId);
	
	@Modifying
	@Query(value = "DELETE FROM order_details WHERE order_id = ?1", nativeQuery = true)
	void deleteOrderDetail(long orderId);
	
	@Query(value = "exec sp_getOrderDetailByOrderId ?1, ?2, ?3", nativeQuery = true)
	List<IOrderDetailDTO> getOrderDetailByOrderId(long orderId, long customerId, long restaurantId);
	
	@Query(value = "exec sp_adminSearchOrder ?1", nativeQuery = true)
	List<IOrderDetailDTO> getOrderDetailByOrderCode(String orderCode);
}
