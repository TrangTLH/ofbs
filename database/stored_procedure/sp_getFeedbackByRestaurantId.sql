CREATE PROCEDURE sp_getFeedbackByRestaurantId
	@restaurant_id bigint, @rate float
AS
DECLARE @sql_select nvarchar(MAX), @sql_feedback nvarchar(MAX), @sql_order_by nvarchar(MAX)
BEGIN
	SET @sql_select = 'SELECT users.id as user_id, users.name as user_name, img.id as image_user_id, fb.rate, fb.feedback_content, fb.feedback_date, fb.restaurant_id
	FROM feedbacks fb
		left join users on fb.customer_id = users.id
		left join images img on img.user_id = fb.customer_id
	WHERE fb.restaurant_id = ' + CAST(@restaurant_id as nvarchar(10)) 
	IF (@rate <> 0 )
	BEGIN 
		SET @sql_feedback = ' and fb.rate = ' + CAST((@rate) as nvarchar(10)) 
	END
	SET @sql_order_by = ' ORDER BY fb.feedback_date desc'
	EXEC (@sql_select + @sql_feedback + @sql_order_by)
END