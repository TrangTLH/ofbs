package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.PaymentHistory;
import edu.fpt.ofbs.models.IPaymentHistoryDTO;

public interface PaymentHistoryService {

	List<IPaymentHistoryDTO> getPaymentHistory(long userId, String paymentCode, String status, String fromDate,
			String toDate, String paymentType);

	void updatePaymentStatus(long paymentHistoryId, String status);

	PaymentHistory save(PaymentHistory paymentHistory);

	PaymentHistory findById(long id);

}
