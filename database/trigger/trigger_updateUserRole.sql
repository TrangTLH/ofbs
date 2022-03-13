CREATE TRIGGER [dbo].[trigger_updateUserRole]
ON [dbo].[provider_restaurants]
AFTER INSERT
AS
BEGIN
	DECLARE @provider_id bigint, @number_of_restaurant int, @role_provider bigint, @role_customer bigint
	SELECT @provider_id = (SELECT provider_id FROM inserted)
	SELECT @number_of_restaurant = (SELECT COUNT(id) FROM provider_restaurants WHERE provider_id = @provider_id)
	SELECT @role_provider = (SELECT id FROM roles WHERE name like 'provider')
	SELECT @role_customer = (SELECT id FROM roles WHERE name like 'customer')
	
	IF(@number_of_restaurant = 1)
	BEGIN
		UPDATE users
		SET role_id = @role_provider
		WHERE users.id = @provider_id 
			and role_id = @role_customer
	END
END