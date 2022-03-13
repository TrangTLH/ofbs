package edu.fpt.ofbs.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

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
@Entity(name = "feedback")
@Table(name = "feedbacks")
public class Feedback {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "feedback_content")
	private String feedbackContent;
	
	@Column(name = "feedback_date")
	private Date feedback_date;
	
	@Column(name = "rate")
	private float rate;
	
	@ManyToOne
	@JoinColumn(name = "restaurant_id", referencedColumnName = "id")
	private Restaurant restaurant;
	
	@ManyToOne
	@JoinColumn(name = "customer_id", referencedColumnName = "id")
	private User user;
	
	@OneToOne
	@JoinColumn(name = "status_id", referencedColumnName = "id")
	private Status status;

}
