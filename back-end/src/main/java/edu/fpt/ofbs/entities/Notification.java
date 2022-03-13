package edu.fpt.ofbs.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
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
@Entity(name = "notification")
@Table(name = "notifications")
public class Notification {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@Column(name = "content")
	private String content;
	
	@ManyToOne
	@JoinColumn(name = "customer_id", referencedColumnName = "id")
	private User customer;
	
	@ManyToOne
	@JoinColumn(name = "provider_id", referencedColumnName = "id")
	private User provider;
	
	private Date date;
	
	@Column(name = "for_admin")
	private boolean forAdmin;
	
	@Column(name = "is_read")
	private boolean isRead;
	
	private String type;
}
