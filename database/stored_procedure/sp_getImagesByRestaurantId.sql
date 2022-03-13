CREATE PROCEDURE sp_getImagesByRestaurantId
	@restaurant_id bigint
AS
BEGIN
	SELECT img.id as image_id, name as image_name
	FROM images img
		join image_types img_tp on img.type_id = img_tp.id
	WHERE restaurant_id = @restaurant_id and img_tp.image_type like 'Description'
END