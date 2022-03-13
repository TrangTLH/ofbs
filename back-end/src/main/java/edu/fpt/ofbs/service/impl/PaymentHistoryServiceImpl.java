package edu.fpt.ofbs.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.fpt.ofbs.entities.PaymentHistory;
import edu.fpt.ofbs.models.IPaymentHistoryDTO;
import edu.fpt.ofbs.repositories.PaymentHistoryRepository;
import edu.fpt.ofbs.repositories.PaymentTypeRepository;
import edu.fpt.ofbs.service.PaymentHistoryService;
import edu.fpt.ofbs.service.StatusService;

@Service
@Transactional
public class PaymentHistoryServiceImpl implements PaymentHistoryService{
	@Autowired
	private PaymentHistoryRepository paymentHistoryRepository;
	
	@Autowired
	private StatusService statusService;
	
	@Autowired
	private PaymentTypeRepository paymentTypeRepository;
	
	@Override
	public List<IPaymentHistoryDTO> getPaymentHistory(long userId, String paymentCode, String status, String fromDate, String toDate, String paymentType){
		return paymentHistoryRepository.getPaymentHistory(userId, paymentCode, status, fromDate, toDate, paymentType);
	}
	
	@Override
	public void updatePaymentStatus(long paymentHistoryId, String status) {
		paymentHistoryRepository.updatePaymentStatus(paymentHistoryId, status);
	}
	
	@Override
	public PaymentHistory save(PaymentHistory paymentHistory) {
		PaymentHistory savePaymentHistory = new PaymentHistory();
		
		savePaymentHistory.setUser(paymentHistory.getUser());
		savePaymentHistory.setBalanceChange(paymentHistory.getBalanceChange());
		savePaymentHistory.setFromToUser(paymentHistory.getFromToUser());
		savePaymentHistory.setCurrentBalance(paymentHistory.getCurrentBalance());
		
		Date paymentDate = new Date();
		
		savePaymentHistory.setDateOfChange(paymentDate);
		savePaymentHistory.setDescription(paymentHistory.getDescription());
		savePaymentHistory.setStatus(statusService.findStatusByName("pending"));
		savePaymentHistory.setPaymentCode("FBS" + paymentDate.getTime());
		savePaymentHistory.setPaymentType(paymentTypeRepository.findPaymentTypeByName(paymentHistory.getPaymentType().getName()));
		
		return paymentHistoryRepository.save(savePaymentHistory);
	}
	
	@Override
	public PaymentHistory findById(long id) {
		return paymentHistoryRepository.findById(id).get();
	}
}
