CREATE PROC sp_getOrderDetailByOrderId @order_id bigint
AS
BEGIN
	SELECT res.id as restaurant_id, res.restaurant_name, res.province, img.id as image_restaurant_id, res_type.name as restaurant_type, ord.id as order_id, 
		ord.order_date, ord.time, ord.organize_date, status.name as order_status, users.email, users.phone_number, 
		ord.number_of_guests, ord.table_type, ord.note, ord.amount as total_amount, pro.name as promotion_name,
		detail.dish_id, dishes.name as dish_name, detail.combo_id, combos.name as combo_name, detail.service_id, 
		services.name as service_name, detail.price, detail.quantity, ord.order_code
	FROM orders ord 
		join status on ord.status_id = status.id
		join provider_restaurants res on ord.restaurant_id = res.id
		join users on ord.customer_id = users.id
		left join promotions pro on ord.promotion_id = pro.id
		join provider_types res_type on res.provider_type_id = res_type.id
		join images img on img.restaurant_id = res.id
		join image_types img_type on img.type_id = img_type.id
		join order_details detail on detail.order_id = ord.id
		left join dishes on detail.dish_id = dishes.id
		left join combos on detail.combo_id = combos.id
		left join services on detail.service_id = services.id
	WHERE img_type.image_type like 'Avatar'
		and ord.id = @order_id
END
