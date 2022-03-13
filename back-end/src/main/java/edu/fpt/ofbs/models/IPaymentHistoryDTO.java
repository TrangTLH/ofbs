package edu.fpt.ofbs.models;

public interface IPaymentHistoryDTO {
	long getId();

	String getPayment_code();

	String getPayment_type();

	String getBalance_change();
	
	String getPhone_login();

	String getName();

	String getDescription();

	String getDate_of_change();

	String getStatus();
}
