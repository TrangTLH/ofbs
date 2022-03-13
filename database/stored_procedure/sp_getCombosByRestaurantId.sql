CREATE PROCEDURE sp_getCombosByRestaurantId
	@restaurant_id bigint
AS
BEGIN
	SELECT cb.id as combo_id, img.id as image_combo_id, cb.name as combo_name, cb.price as combo_price
	FROM  combos cb 
		join images img on img.combo_id = cb.id 
	WHERE cb.restaurant_id =  @restaurant_id
		and cb.status_id = 1
	ORDER BY cb.id asc
END
