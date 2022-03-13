CREATE TRIGGER [dbo].[insert_null_id]
ON [dbo].[images]
INSTEAD OF INSERT
AS
BEGIN
    DECLARE @id varchar(255), @name nvarchar(50), @value varbinary(MAX), @user_id bigint, @dish_id bigint,  
			@service_id bigint, @combo_id bigint, @restaurant_id bigint, @promotion_id bigint, @type_id bigint;
    SELECT @id = id, @name = name, @value = value, @user_id = user_id, @dish_id = dish_id,  
			@service_id = service_id, @combo_id = combo_id, @restaurant_id = restaurant_id, @promotion_id = promotion_id, 
			@type_id = type_id
    FROM inserted
	IF (@user_id = 0)
		BEGIN
		 SET @user_id = NULL
		END
	IF (@dish_id = 0)
		BEGIN
		 SET @dish_id = NULL
		END
	IF (@service_id = 0)
		BEGIN
		 SET @service_id = NULL
		END
	IF (@combo_id = 0)
		BEGIN
		 SET @combo_id = NULL
		END
	IF (@restaurant_id = 0)
		BEGIN
		 SET @restaurant_id = NULL
		END
	IF (@promotion_id = 0)
		BEGIN
		 SET @promotion_id = NULL
		END
	INSERT INTO [dbo].[images] ([id], [name], [value], [user_id], [dish_id], [service_id], [combo_id], [restaurant_id], 
	[promotion_id], [type_id])
    VALUES (@id, @name, @value, @user_id, @dish_id, @service_id, @combo_id, @restaurant_id, @promotion_id, @type_id)
END
