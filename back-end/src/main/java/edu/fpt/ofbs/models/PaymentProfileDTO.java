package edu.fpt.ofbs.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentProfileDTO {
	private String bankCode;
	
	private String fullName;
	
	private String email;
	
	private String mobile;
	
	private String paymentMethod;
	
	private String orderCode;
	
	private String totalAmount;
	
	private String orderDescription;
}
