package edu.fpt.ofbs.models;

import java.util.Date;

public interface INotificationDTO {
	long getId();

	String getContent();

	String getCustomer_id();

	String getProvider_id();

	Date getDate();

	String getType();
}
