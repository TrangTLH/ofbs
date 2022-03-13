CREATE TRIGGER [dbo].[trigger_insertOrderDetail]
ON [dbo].[order_details]
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @price float, @quantity int, @dish_id bigint, @combo_id bigint, @service_id bigint, @order_id bigint;
    SELECT @quantity = quantity, @dish_id = dish_id, @combo_id = combo_id, 
		@service_id = service_id, @order_id = order_id
    FROM inserted
	IF (@dish_id = 0)
		BEGIN
		 SET @dish_id = NULL
		END
	IF (@combo_id = 0)
		BEGIN
		 SET @combo_id = NULL
		END
	IF (@service_id = 0)
		BEGIN
		 SET @service_id = NULL
		END
	IF (@dish_id <> 0)
		BEGIN
			SELECT @price = (SELECT dishes.price FROM dishes WHERE dishes.id = @dish_id)
		END
	IF (@combo_id <> 0)
		BEGIN
			SELECT @price = (SELECT combos.price FROM combos WHERE combos.id = @combo_id)
		END
	IF (@service_id <> 0)
		BEGIN
			SELECT @price = (SELECT services.price FROM services WHERE services.id = @service_id)
		END
	INSERT INTO [dbo].[order_details]([price], [quantity], [dish_id], [combo_id], [service_id], [order_id])
	VALUES(@price, @quantity, @dish_id, @combo_id, @service_id, @order_id)
END

