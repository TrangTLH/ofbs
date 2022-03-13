CREATE TRIGGER [dbo].[trigger_updateOrderAmount]
ON [dbo].[order_details]
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
	DECLARE @order_id bigint
	SELECT @order_id = (SELECT order_id FROM inserted)

	--Update amount
	UPDATE orders
    SET amount = (SELECT SUM(order_details.price * order_details.quantity)
				  FROM order_details
				  WHERE order_details.order_id = @order_id
				  GROUP BY order_details.order_id)
    WHERE orders.id = @order_id
END