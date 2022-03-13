package edu.fpt.ofbs.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
//import javax.persistence.JoinColumn;
import javax.persistence.Lob;
//import javax.persistence.ManyToOne;
//import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

//import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@NoArgsConstructor
@Getter
@Setter
@Entity(name = "image")
@Table(name = "images")
public class Image {
	@Id
	@GeneratedValue(generator = "uuid")
	@GenericGenerator(name = "uuid", strategy = "uuid2")
	private String id;

	@Column(name = "name")
	private String name;

	@Lob
	private byte[] value;
	
	@Column(name = "user_id")
	private String userId;
	
	@Column(name = "dish_id")
	private String dishId;
	
	@Column(name = "service_id")
	private String serviceId;
	
	@Column(name = "combo_id")
	private String comboId;
	
	@Column(name = "restaurant_id")
	private String restaurantId;
	
	@Column(name = "promotion_id")
	private String promotionId;
	
	@Column(name = "type_id")
	private String typeId;

	public Image(String name, byte[] value, String userId, String dishId, String serviceId, String comboId,
			String restaurantId, String promotionId, String typeId) {
		super();
		this.name = name;
		this.value = value;
		this.userId = userId;
		this.dishId = dishId;
		this.serviceId = serviceId;
		this.comboId = comboId;
		this.restaurantId = restaurantId;
		this.promotionId = promotionId;
		this.typeId = typeId;
	}
	
}
