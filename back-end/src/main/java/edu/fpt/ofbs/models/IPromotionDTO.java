package edu.fpt.ofbs.models;

import java.util.Date;

public interface IPromotionDTO {
	long getPromotion_id();
	
	long getRestaurant_id();

	String getPromotion_name();

	String getDescription();

	String getImage_id();

	Date getStart_date();

	Date getEnd_date();
	
	String getPromotion_status();
	
	float getDiscount_percentage();
}
