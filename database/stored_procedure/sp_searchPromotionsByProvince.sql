CREATE PROC sp_searchPromotionByProvince @province nvarchar(50)
AS
DECLARE @status_id_active bigint, @status_id_coming bigint, @sql_select nvarchar(MAX), @sql_prov nvarchar(MAX), 
		@sql_order_by nvarchar(MAX)
SELECT @status_id_active = (SELECT id FROM status WHERE status.name like N'active')
SELECT @status_id_coming = (SELECT id FROM status WHERE status.name like N'coming')
BEGIN
SET @sql_select = 'SELECT pro.id as promotion_id, res.id as restaurant_id, pro.name as promotion_name, pro.description, 
						img.id as image_id, pro.start_date, pro.end_date, status.name as promotion_status
				   FROM promotions pro
						left join images img on img.promotion_id = pro.id
						left join provider_restaurants res on pro.restaurant_id = res.id
						join status on pro.status_id = status.id
				   WHERE pro.status_id = ' + CAST(@status_id_active as nvarchar(50))
				+ ' or pro.status_id = ' + CAST(@status_id_coming as nvarchar(50))
IF (@province <> '')
	BEGIN
		 SET @sql_prov = ' and res.province like N' + '''%' + @province + '%''' 
	END
SET @sql_order_by = ' ORDER BY pro.start_date desc '
EXEC (@sql_select + @sql_prov + @sql_order_by)
END