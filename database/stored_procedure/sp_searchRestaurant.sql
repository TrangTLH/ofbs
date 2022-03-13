CREATE PROC sp_searchRestaurant @restaurant_type bigint, 
							   @restaurant_province nvarchar(50), 
							   @restaurant_district nvarchar(50), 
							   @restaurant_name nvarchar(255)
AS
DECLARE @provider_type nvarchar(255), @sql_select nvarchar(MAX), @sql_res_type nvarchar(MAX), @sql_res_prov nvarchar(MAX),
		@sql_res_dis nvarchar(MAX), @sql_res_name nvarchar(MAX), @sql_group nvarchar(MAX)
BEGIN
IF (@restaurant_type = 1)
	BEGIN
		 SET @provider_type = N'%Tổ chức lưu động%'
	END
IF (@restaurant_type = 2) 
	BEGIN
		SET @provider_type = N'%Tổ chức tại cơ sở%'
	END
IF (@restaurant_type = 3) 
	BEGIN
		SET @provider_type = N'Tổ chức lưu động và Tổ chức tại cơ sở'
	END

SET @sql_select = 'SELECT res.id as restaurant_id, img_tp.image_type, pr_tp.name as restaurant_type, res.restaurant_name, 
						img.id as image_id, res.province, res.size, ISNULL(AVG(fb.rate), 0) as rate, res.description, status.name as restaurant_status
				   FROM provider_restaurants res 
						join provider_types pr_tp on pr_tp.id =  res.provider_type_id 
						left join images img on img.restaurant_id = res.id
						join image_types img_tp on img.type_id = img_tp.id
						join feedbacks fb on fb.restaurant_id = res.id and fb.rate > 0
						join status on status.id = res.status_id
					WHERE status.name like N' + '''' + 'active' + ''''
					+ ' and img_tp.image_type like ' + '''' + 'Avatar' + ''''
IF (@restaurant_type <> 0)
	BEGIN
		 SET @sql_res_type = ' and pr_tp.name like N' + '''%'  + @provider_type + '%''' 
	END
IF (@restaurant_province <> '')
	BEGIN
		 SET @sql_res_prov = ' and res.province like N' + '''%' + @restaurant_province + '%''' 
	END
IF (@restaurant_district <> '')
	BEGIN
		 SET @sql_res_dis = ' and res.district like N' + '''%' + @restaurant_district + '%''' 
	END
IF (@restaurant_name <> '')
	BEGIN
		 SET @sql_res_name = ' and res.restaurant_name like N' + '''%' + @restaurant_name + '%''' 
	END
SET @sql_group = ' GROUP BY res.id, res.restaurant_name, img.id, res.province, res.size, img_tp.image_type, pr_tp.name, status.name, res.description
				 ORDER BY rate desc '
EXEC (@sql_select + @sql_res_type + @sql_res_prov + @sql_res_dis + @sql_res_name + @sql_group)
END