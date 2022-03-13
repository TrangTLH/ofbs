CREATE PROC sp_getRestaurantsByProviderId  @provider_id bigint,
										  @restaurant_status_id bigint
AS
DECLARE @restaurant_status nvarchar(50)
BEGIN
IF (@restaurant_status_id = 1)
	BEGIN
		 SET @restaurant_status = N'active'
	END
IF (@restaurant_status_id = 2) 
	BEGIN
		SET @restaurant_status = N'inactive'
	END
IF (@restaurant_status_id = 3) 
	BEGIN
		SET @restaurant_status = N'pending'
	END
IF (@restaurant_status_id = 4) 
	BEGIN
		SET @restaurant_status = N'cancelled'
	END

SELECT res.id as restaurant_id, img_tp.image_type, pr_tp.name as restaurant_type, res.restaurant_name, img.id as image_id, 
	res.province, res.size, ISNULL(AVG(fb.rate), 0) as rate, res.description, status.name as restaurant_status
FROM provider_restaurants res 
	join provider_types pr_tp on pr_tp.id =  res.provider_type_id 
	left join images img on img.restaurant_id = res.id
    left join image_types img_tp on img.type_id = img_tp.id and img_tp.image_type like 'Avatar'
	left join feedbacks fb on  fb.restaurant_id = res.id and fb.rate > 0
    join status on status.id = res.status_id
WHERE res.provider_id = @provider_id
    and status.name like @restaurant_status
GROUP BY res.id, res.restaurant_name, img.id, res.province, res.size, img_tp.image_type, pr_tp.name, res.description, status.name
END

EXEC sp_getRestaurantsByProviderId 7, 3
