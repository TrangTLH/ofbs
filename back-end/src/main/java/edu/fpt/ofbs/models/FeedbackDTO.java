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
public class FeedbackDTO {
	private long user_id;
	
	private String user_name;
	
	private float rate;
	
	private String feedback_content;
	
	private Date feedback_date;
	
	private long restaurant_id;
	
	private String image_user_id;
}
