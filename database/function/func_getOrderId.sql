CREATE FUNCTION func_getOrderId (@customer_id bigint, @restaurant_id bigint)
RETURNS bigint
AS
BEGIN
    DECLARE @order_id bigint;
    SELECT @order_id = orders.id
    FROM orders
		join status on orders.status_id = status.id
    WHERE customer_id = @customer_id 
		and restaurant_id = @restaurant_id
		and status.name like N'draft'
    RETURN @order_id
END