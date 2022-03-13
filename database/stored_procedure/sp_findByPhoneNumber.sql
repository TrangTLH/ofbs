CREATE PROCEDURE sp_findByPhoneNumber
	@phone_number varchar(50)
AS
BEGIN
	Select * from users u where u.phone_login = @phone_number;
END