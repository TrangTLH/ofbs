package edu.fpt.ofbs.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
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
@Entity(name = "payment_history")
@Table(name = "payment_histories")
public class PaymentHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@OneToOne
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	private User user;
	
	@Column(name = "balance_change")
	private float balanceChange;
	
	@OneToOne
	@JoinColumn(name = "from_to_user_id", referencedColumnName = "id")
	private User fromToUser;
	
	@Column(name = "current_balance")
	private float currentBalance;
	
	@Column(name = "date_of_change")
	private Date dateOfChange;
	
	@Column(name = "description")
	private String description;
	
	@OneToOne
	@JoinColumn(name = "status_id", referencedColumnName = "id")
	private Status status;
	
	@Column(name = "payment_code")
	private String paymentCode;
	
	@OneToOne
	@JoinColumn(name = "payment_type_id", referencedColumnName = "id")
	private PaymentType paymentType;
}
