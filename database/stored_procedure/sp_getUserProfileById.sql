CREATE PROC sp_getUserProfileById @user_id bigint
AS
BEGIN
	SELECT users.name as user_name, images.id as image_id, users.email, users.phone_number, users.gender, 
		users.date_of_birth, users.address
	FROM users	
		left join images on users.id = images.user_id
	WHERE users.id  = @user_id
END

