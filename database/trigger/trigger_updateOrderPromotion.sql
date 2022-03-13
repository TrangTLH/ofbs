CREATE TRIGGER [dbo].[trigger_updateOrderPromotion]
ON [dbo].[orders]
AFTER INSERT
AS
BEGIN
	
	--Update promotion_id
    DECLARE @order_id int, @order_date datetime, @promotion_id bigint, @restaurant_id bigint
	SELECT @order_id = (SELECT id FROM inserted) 
    SELECT @order_date = (SELECT order_date FROM inserted) 
	SELECT @restaurant_id = (SELECT restaurant_id FROM inserted)
	SELECT @promotion_id = (SELECT promotions.id FROM promotions 
							WHERE restaurant_id = @restaurant_id 
								and promotions.start_date <= @order_date 
								and @order_date <= promotions.end_date)
	UPDATE orders
	SET promotion_id = @promotion_id
	WHERE id = @order_id
END