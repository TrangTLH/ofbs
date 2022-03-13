package edu.fpt.ofbs.models;

import java.util.Date;

public interface IFeedbackDTO {
	long getUser_id();

	String getUser_name();

	float getRate();

	String getFeedback_content();

	Date getFeedback_date();
	
	long getRestaurant_id();
	
	String getImage_user_id();
}
