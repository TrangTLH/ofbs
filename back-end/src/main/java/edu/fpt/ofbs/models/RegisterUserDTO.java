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
public class RegisterUserDTO {
	private String phoneLogin;

	private String name;
	
	private String password;
	
	private String phoneNumber;
	
	private long roleId;
	
	private long statusId;
	
	private Date lastModified;

}
