package edu.fpt.ofbs.models;

import edu.fpt.ofbs.entities.User;
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
public class ResponseJwt {
	private User user;

	private String token;

}
