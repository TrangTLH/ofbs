CREATE PROCEDURE sp_getDishesByComboId
	@combo_id bigint
AS
BEGIN
	SELECT d.id, d.name as dish_name, img.id as image_dish_id, d.price
	FROM dish_combo d_cb 
		join combos cb on cb.id = d_cb.combo_id
		join dishes d on d.id = d_cb.dish_id
		join images img on img.dish_id = d.id
		WHERE cb.id =  @combo_id
	ORDER BY d.menu_category_id asc
END
