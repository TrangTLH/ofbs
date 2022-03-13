package edu.fpt.ofbs.models;

public interface IDishDTO {
	long getId();

	String getDish_name();

	String getImage_dish_id();

	float getPrice();

	long getRestaurant_id();

	String getCategory_name();

	String getStatus_name();
}
