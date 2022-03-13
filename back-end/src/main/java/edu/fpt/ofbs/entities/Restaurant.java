package edu.fpt.ofbs.entities;

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
@Entity(name = "restaurant")
@Table(name = "provider_restaurants")
public class Restaurant {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	
	@ManyToOne
	@JoinColumn(name = "provider_id", referencedColumnName = "id")
	private User provider;
	
	private String province;
	
	private String district;
	
	private String address;
	
	@Column(name = "phone_number")
	private String phoneNumber;
	
	@Column(name = "business_license_id")
	private String bussinessLicenseId;
	
	@Column(name = "restaurant_name")
	private String restaurantName;
	
	@OneToOne
	@JoinColumn(name = "status_id", referencedColumnName = "id")
	private Status status;
	
	private String description;
	
	private int size;
	
	@OneToOne
	@JoinColumn(name = "provider_type_id", referencedColumnName = "id")
	private ProviderType providerType;

}
