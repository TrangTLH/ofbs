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
public class OrderDetailSaveDTO {
	private int quantity;
	
	private long dishId;
	
	private long comboId;
	
	private long serviceId;
	
	private long customerId;
	
	private long restaurantId;
}
