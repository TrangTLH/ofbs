ALTER PROCEDURE sp_getRestaurantsByType
	@restaurant_type bigint
AS
BEGIN
	DECLARE @_type nvarchar(255);
	IF (@restaurant_type = 1)
	BEGIN
		set @_type = N'%Tổ chức lưu động%';
	END
	IF (@restaurant_type = 2) 
	BEGIN
		set @_type = N'%Tổ chức tại cơ sở%';
	END
	IF (@restaurant_type = 3) 
	BEGIN
		set @_type = N'Tổ chức lưu động và Tổ chức tại cơ sở';
	END
	SELECT TOP 10 res.id as restaurant_id, img_tp.image_type, pr_tp.name as restaurant_type, res.restaurant_name, 
		img.id as image_id, res.province, res.size, ISNULL(AVG(fb.rate), 0) as rate, res.description, status.name as restaurant_status
	FROM provider_restaurants res 
		join provider_types pr_tp on pr_tp.id =  res.provider_type_id 
		join images img on img.restaurant_id = res.id
		join image_types img_tp on img.type_id = img_tp.id
		join feedbacks fb on  fb.restaurant_id = res.id and fb.rate > 0
		join status on status.id = res.status_id
	WHERE img_tp.image_type like 'Avatar' 
		and pr_tp.name like @_type
		and status.name like 'active'
	GROUP BY res.id, res.restaurant_name, img.id, res.province, res.size, img_tp.image_type, pr_tp.name, status.name, res.description
	ORDER BY rate desc
END