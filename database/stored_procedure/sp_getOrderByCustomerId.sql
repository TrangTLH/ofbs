CREATE PROCEDURE sp_getOrderByCustomerId
	@customer_id bigint, @status_id bigint 
AS
DECLARE @order_status nvarchar(50)
IF (@status_id = 1)
	BEGIN
		 SET @order_status = N'pending'
	END
IF (@status_id = 2) 
	BEGIN
		SET @order_status = N'preparing'
	END
IF (@status_id = 3) 
	BEGIN
		SET @order_status = N'accomplished'
	END
IF (@status_id = 4) 
	BEGIN
		SET @order_status = N'cancelled'
	END
BEGIN
	SELECT res.restaurant_name, img.id as image_restaurant_id, ord.id as order_id, ord.order_date, 
		res_type.name as restaurant_type, ord.time, ord.amount, status.name as order_status, ord.organize_date, ord.order_code
	FROM orders ord
		join provider_restaurants res on ord.restaurant_id = res.id
		join images img on img.restaurant_id = res.id
		join provider_types res_type on res.provider_type_id = res_type.id
		join image_types img_type on img.type_id = img_type.id
		join status on status.id = ord.status_id
	WHERE img_type.image_type like 'Avatar' 
		and ord.customer_id = @customer_id 
		and status.name like @order_status
	ORDER BY order_date desc
END
