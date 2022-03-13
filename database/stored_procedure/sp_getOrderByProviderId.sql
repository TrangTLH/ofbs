CREATE PROCEDURE sp_getOrderByProviderId
	@provider_id bigint
AS
BEGIN
	SELECT res.restaurant_name, img.id as image_restaurant_id, ord.id as order_id, ord.order_date, 
		res_type.name as restaurant_type, ord.time, ord.amount, status.name as order_status, ord.organize_date, ord.order_code
	FROM orders ord 
		join status on ord.status_id = status.id
		join provider_restaurants res on ord.restaurant_id = res.id
		join users on res.provider_id = users.id
		join provider_types res_type on res.provider_type_id = res_type.id
		join images img on img.restaurant_id = res.id
		join image_types img_type on img.type_id = img_type.id
	WHERE img_type.image_type like 'Avatar'  
		and provider_id = @provider_id 
		ORDER BY ord.order_date desc
END
