package edu.fpt.ofbs.models;

import java.util.Date;

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
public class OrderDTO {
	private String time;

	private long customerId;

	private long restaurantId;

	private int tableType;

	private int numberOfGuests;

	private String note;

	private Date organizeDate;

	private String orderCode;

	private String organizeAddress;

	private String organizeWard;

	private String organizeDistrict;

	private String organizeProvince;

}
