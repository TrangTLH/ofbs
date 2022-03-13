package edu.fpt.ofbs.models;

import java.util.Date;

public interface IOrderDetailDTO {
	long getRestaurant_id();

	String getRestaurant_name();

	String getProvince();

	String getImage_restaurant_id();

	String getRestaurant_type();

	long getOrder_id();

	Date getOrder_date();

	String getTime();

	Date getOrganize_date();

	String getOrder_status();

	long getCustomer_id();

	String getCustomer_phone_number();

	int getNumber_of_guests();

	int getTable_type();

	String getNote();

	float getTotal_amount();

	String getPromotion_name();

	String getDish_id();

	String getDish_name();

	String getCombo_id();

	String getCombo_name();

	String getService_id();

	String getService_name();

	float getPrice();

	int getQuantity();
	
	String getOrder_code();
	
	String getOrganize_address();
	
	String getOrganize_ward();
	
	String getOrganize_district();
	
	String getOrganize_province();
	
	String getRestaurant_phone_number();
}
