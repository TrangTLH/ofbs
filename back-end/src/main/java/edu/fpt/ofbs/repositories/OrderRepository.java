package edu.fpt.ofbs.repositories;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.Order;
import edu.fpt.ofbs.models.IOrderDTO;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>{
	@Query(value = "exec sp_getOrderByCustomerId ?1, ?2", nativeQuery = true)
	List<IOrderDTO> getOrderByCustomerId (long customerId, long statusId);
	
	@Query(value = "exec sp_getOrderByRestaurantId ?1, ?2", nativeQuery = true)
	List<IOrderDTO> getOrderByRestaurantId (long restaurantId, String orderCode);
	
	@Modifying
	@Query(value = "exec sp_insertOrder ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13", nativeQuery = true)
	void insertOrder(String time, Date orderDate, long customerId, long restaurantId, int tableType, int NumberOfGuests, String note, Date organizeDate, String orderCode, 
			String organizeAddress, String organizeWard, String organizeDistrict, String organizeProvince);
	
	@Modifying
	@Query(value = "exec sp_setOrderStatus ?1, ?2", nativeQuery = true)
	void setOrderStatus(long customerId, long restaurantId);
	
	@Modifying
	@Query(value = "exec sp_updateOrderStatus ?1, ?2", nativeQuery = true)
	void updateOrderStatus(long orderId, String status);
	
	@Query(value = "exec sp_getTotalOrderByStatus ?1, ?2, ?3", nativeQuery = true)
	int getTotalOrderByStatus(String status, String fromDate, String toDate);
	
	@Query(value = "exec sp_adminGetOrders ?1, ?2, ?3, ?4", nativeQuery = true)
	List<IOrderDTO> getOrders(String orderCode, String fromDate, String toDate, String status);
	
	@Query(value = "SELECT dbo.func_getOrderId(?1, ?2)", nativeQuery = true)
	long getOrderIdBeforeInsert(long customerId, long restaurantId);
}
