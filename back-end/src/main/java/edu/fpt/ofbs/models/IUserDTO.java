package edu.fpt.ofbs.models;

import java.util.Date;

public interface IUserDTO {
	String getUser_name();

	String getImage_id();

	String getEmail();

	String getPhone_number();

	boolean getGender();

	Date getDate_of_birth();

	String getAddress();
}
