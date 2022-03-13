CREATE PROC sp_searchDishesByName @restaurant_id bigint, 
							      @dish_name nvarchar(255)
AS
DECLARE @sql_select nvarchar(MAX), @sql_dish_name nvarchar(MAX)
BEGIN
SET @sql_select = 'SELECT d.id, d.name as dish_name, img.id as image_dish_id, d.price
				   FROM dishes d 
						join images img on img.dish_id = d.id
				   WHERE d.status_id = 1
						and d.restaurant_id = ' + CAST(@restaurant_id as nvarchar(50))
IF (@dish_name <> '')
	BEGIN
		 SET @sql_dish_name = ' and d.name like N' + '''%' + @dish_name + '%''' 
	END
EXEC (@sql_select + @sql_dish_name)
END

