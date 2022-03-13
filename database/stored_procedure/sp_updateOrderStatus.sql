CREATE PROC sp_updateOrderStatus (@customer_id bigint,
								  @restaurant_id bigint)
AS
DECLARE @status_id_pending bigint, @status_id_draft bigint
SELECT @status_id_pending = (SELECT id FROM status WHERE name like N'pending')
SELECT @status_id_draft = (SELECT id FROM status WHERE name like N'draft')
BEGIN 
	UPDATE orders 
	SET status_id = @status_id_pending
	WHERE customer_id = @customer_id
		and restaurant_id = @restaurant_id
		and status_id = @status_id_draft
END