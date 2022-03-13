package edu.fpt.ofbs.models;

public interface IRestaurantDTO {
	long getRestaurant_id();

	String getImage_type();

	String getRestaurant_type();

	String getRestaurant_name();

	String getImage_id();

	String getProvince();

	long getSize();

	float getRate();

	String getDescription();
	
	String getRestaurant_status();
	
	long getProvider_id();
	
	String getBusiness_license_id();
}
