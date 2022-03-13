CREATE PROC sp_getPromotionsByRestaurantId @restaurant_id bigint
AS
DECLARE @status_id_active bigint, @status_id_coming bigint
SELECT @status_id_active = (SELECT id FROM status WHERE status.name like N'active')
SELECT @status_id_coming = (SELECT id FROM status WHERE status.name like N'coming')
BEGIN
	SELECT pro.id as promotion_id, res.id as restaurant_id, pro.name as promotion_name, pro.description, 
		img.id as image_id, pro.start_date, pro.end_date, status.name as promotion_status
	FROM promotions pro
		left join images img on img.promotion_id = pro.id
		left join provider_restaurants res on pro.restaurant_id = res.id
		join status on pro.status_id = status.id
	WHERE res.id = @restaurant_id 
		and pro.status_id = @status_id_active 
		or pro.status_id = @status_id_coming
	ORDER BY pro.start_date desc
END