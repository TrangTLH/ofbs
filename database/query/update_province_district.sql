UPDATE provider_restaurants
SET province = N'Thành phố Hà Nội' WHERE province like N'Hà Nội'

UPDATE provider_restaurants
SET province = N'Thành phố Hồ Chí Minh' WHERE province like N'TP. Hồ Chí Minh'

UPDATE provider_restaurants
SET province = N'Tỉnh Thanh Hóa' WHERE province like N'Thanh Hóa'

UPDATE provider_restaurants
SET district = N'Huyện Thường Xuân' WHERE district like N'Thường Xuân'

UPDATE provider_restaurants
SET district = N'Huyện Thạch Thất' WHERE district like N'Thạch Thất'

UPDATE provider_restaurants
SET district = N'Huyện Nông Cống' WHERE district like N'Nông Cống'

UPDATE provider_restaurants
SET district = N'Quận Hoàn Kiếm' WHERE district like N'Hoàn Kiếm'

UPDATE provider_restaurants
SET district = N'Quận Đống Đa' WHERE district like N'Đống Đa'

UPDATE provider_restaurants
SET district = N'Quận Nam Từ Liêm' WHERE district like N'Nam Từ Liêm'

UPDATE provider_restaurants
SET district = N'Quận Hà Đông' WHERE district like N'Hà Đông'

UPDATE provider_restaurants
SET district = N'Quận Cầu Giấy' WHERE district like N'Cầu Giấy'

UPDATE provider_restaurants
SET district = N'Quận Tây Hồ' WHERE district like N'Tây Hồ'

UPDATE provider_restaurants
SET district = N'Quận Ba Đình' WHERE district like N'Ba Đình'

UPDATE provider_restaurants
SET district = N'Quận Thanh Xuân' WHERE district like N'Thanh Xuân'

UPDATE provider_restaurants
SET district = N'Quận Hoàng Mai' WHERE district like N'Hoàng Mai'

UPDATE provider_restaurants
SET district = N'Quận Hai Bà Trưng' WHERE district like N'Hai Bà Trưng'

UPDATE provider_restaurants
SET district = N'Quận Bắc Từ Liêm' WHERE district like N'Bắc Từ Liêm'

UPDATE provider_restaurants
SET district = N'Huyện Củ Chi' WHERE district like N'Củ Chi'

UPDATE provider_restaurants
SET district = N'Huyện Vĩnh Lộc' WHERE district like N'Vĩnh Lộc'

UPDATE provider_restaurants
SET district = N'Thành phố Thanh Hóa' WHERE district like N'TP. Thanh Hóa'

UPDATE provider_restaurants
SET address = N'Phường Ba Đình' WHERE id = 92

UPDATE dishes
SET restaurant_id = 30 WHERE id >= 12 AND ID <= 24

UPDATE dishes
SET name = N'Xôi vò' WHERE id = 19
