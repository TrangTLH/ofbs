package edu.fpt.ofbs.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.PaymentHistory;
import edu.fpt.ofbs.models.IPaymentHistoryDTO;

@Repository
public interface PaymentHistoryRepository extends JpaRepository<PaymentHistory, Long>{
	@Query(value = "exec [sp_searchPaymentHistory] ?1, ?2, ?3, ?4, ?5, ?6", nativeQuery = true)
	List<IPaymentHistoryDTO> getPaymentHistory(long userId, String paymentCode, String status, String fromDate, String toDate, String paymentType);
	
	@Modifying
	@Query(value = "exec sp_updatePaymentStatus ?1, ?2", nativeQuery = true)
	void updatePaymentStatus(long paymentHistoryId, String status);
}
