package edu.fpt.ofbs.models;

public interface IServiceDTO {
	long getId();

	String getService_name();

	String getImage_service_id();

	float getPrice();

	long getRestaurant_id();

	String getService_category_name();

	String getStatus_name();
}
