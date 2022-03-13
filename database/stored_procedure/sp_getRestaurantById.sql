CREATE PROCEDURE sp_getRestaurantById	@restaurant_id bigint
AS
BEGIN
	SELECT res.id as restaurant_id, img_tp.image_type, pr_tp.name as restaurant_type, res.restaurant_name, 
		img.id as image_id, res.province, res.size, ISNULL(AVG(fb.rate), 0) as rate, res.description, status.name as restaurant_status
	FROM provider_restaurants res 
		join provider_types pr_tp on pr_tp.id =  res.provider_type_id 
		left join images img on img.restaurant_id = res.id
		left join image_types img_tp on img.type_id = img_tp.id
		left join feedbacks fb on  fb.restaurant_id = res.id and fb.rate > 0
		join status on status.id = res.status_id
	WHERE res.id = @restaurant_id
	GROUP BY res.id, res.restaurant_name, img.id, res.province, res.size, img_tp.image_type, pr_tp.name, res.description, status.name
END