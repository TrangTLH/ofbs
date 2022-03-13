CREATE PROC sp_insertOrderDetail (@quantity bigint, 
								  @dish_id bigint, 
								  @combo_id bigint, 
								  @service_id bigint, 
								  @customer_id bigint,
								  @restaurant_id bigint)
AS
DECLARE @order_id bigint
SELECT @order_id = (SELECT dbo.func_getOrderId(@customer_id, @restaurant_id))
BEGIN 
	INSERT [dbo].[order_details]
           ([quantity]
		   ,[dish_id]
           ,[combo_id]
		   ,[service_id]
           ,[order_id])
    VALUES
           (@quantity
		   ,@dish_id
		   ,@combo_id
		   ,@service_id
		   ,@order_id)
END