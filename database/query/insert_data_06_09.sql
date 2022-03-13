USE [OFBS]
GO
SET IDENTITY_INSERT [dbo].[dishes] ON 
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (25, N'Rượu vang', N'Đồ uống', 100000, 30, 4, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (26, N'Nước cam', N'Đồ uống', 100000, 30, 4, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (27, N'Bia', N'Đồ uống', 100000, 30, 4, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (28, N'Nước ngọt', N'Đồ uống', 100000, 30, 4, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (29, N'Súp hải sản đậu Nhật', N'Món súp', 100000, 30, 1, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (30, N'Nộm cung đình', N'Món nộm', 100000, 30, 1, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (31, N'Tôm sú chiên trứng mặn', N'Món tôm', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (32, N'Gà Đông Tảo hấp lá chanh', N'Món gà', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (33, N'Bò hầm đậu ngự + Bánh mỳ', N'Món bò', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (34, N'Cá quả nướng lá lốt', N'Món cá', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (35, N'Xôi vò hạt sen', N'Món cơm, xôi', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (37, N'Củ quả luộc chấm muối vừng', N'Món rau', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (38, N'Cơm trắng', N'Món cơm, xôi', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (39, N'Quýt Sài Gòn', N'Hoa quả', 100000, 30, 3, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (42, N'Súp cua bể măng tây', N'Món súp', 100000, 30, 1, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (43, N'Salad kiểu Nhật', N'Món salad', 100000, 30, 1, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (44, N'Tôm sú hoàng đế', N'Món tôm', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (45, N'Gà ủ muối bọc lá sen', N'Món gà', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (46, N'Đùi lợn hầm kiểu Đức + Bánh mỳ', N'Món lợn', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (47, N'Cá tầm rang muối', N'Món cá', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (48, N'Xôi trắng, ruốc, lạp xưởng', N'Món cơm, xôi', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (49, N'Canh cá tầm nấu chua', N'Món cá', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (50, N'Lơ xanh xào', N'Món rau', 100000, 30, 2, 1)
GO
INSERT [dbo].[dishes] ([id], [name], [description], [price], [restaurant_id], [menu_category_id], [status_id]) VALUES (51, N'Hoa quả thập cẩm', N'Hoa quả', 100000, 30, 3, 1)
GO
SET IDENTITY_INSERT [dbo].[dishes] OFF
GO

GO
SET IDENTITY_INSERT [dbo].[combos] ON 
GO
INSERT [dbo].[combos] ([id], [name], [description], [price], [restaurant_id], [status_id]) VALUES (1, N'Thực đơn số 1', N'Thực đơn số 1', 1100000, 30, 1)
GO
INSERT [dbo].[combos] ([id], [name], [description], [price], [restaurant_id], [status_id]) VALUES (3, N'Thực đơn số 2', N'Thực đơn số 2', 1100000, 30, 1)
GO
INSERT [dbo].[combos] ([id], [name], [description], [price], [restaurant_id], [status_id]) VALUES (4, N'Thực đơn số 3', N'Thực đơn số 3', 1100000, 30, 1)
GO
INSERT [dbo].[combos] ([id], [name], [description], [price], [restaurant_id], [status_id]) VALUES (5, N'Thực đơn số 4', N'Thực đơn số 4', 1100000, 30, 1)
GO
SET IDENTITY_INSERT [dbo].[combos] OFF
GO
SET IDENTITY_INSERT [dbo].[dish_combo] ON 
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (1, 1, 2)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (2, 1, 3)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (3, 1, 4)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (4, 1, 5)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (5, 1, 6)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (6, 1, 7)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (7, 1, 8)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (8, 1, 9)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (9, 1, 10)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (10, 1, 11)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (11, 1, 25)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (12, 1, 26)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (13, 1, 27)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (14, 1, 28)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (18, 3, 12)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (19, 3, 13)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (20, 3, 14)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (21, 3, 16)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (22, 3, 17)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (23, 3, 18)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (24, 3, 19)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (25, 3, 20)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (26, 3, 21)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (27, 3, 22)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (29, 3, 24)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (30, 3, 25)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (31, 3, 26)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (32, 3, 27)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (33, 3, 28)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (34, 4, 29)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (35, 4, 39)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (36, 4, 31)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (37, 4, 32)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (38, 4, 33)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (39, 4, 34)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (40, 4, 35)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (42, 4, 37)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (43, 4, 38)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (44, 4, 39)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (45, 4, 25)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (46, 4, 26)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (47, 4, 27)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (48, 4, 28)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (49, 5, 42)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (50, 5, 43)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (51, 5, 44)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (52, 5, 45)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (53, 5, 46)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (54, 5, 47)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (55, 5, 48)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (56, 5, 49)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (57, 5, 50)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (58, 5, 51)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (59, 5, 25)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (60, 5, 26)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (61, 5, 27)
GO
INSERT [dbo].[dish_combo] ([id], [combo_id], [dish_id]) VALUES (62, 5, 28)
GO
SET IDENTITY_INSERT [dbo].[dish_combo] OFF
GO

UPDATE users 
SET name = 'trangtlh' WHERE id = 6

UPDATE users
SET name = 'thanhlt' WHERE id = 7

UPDATE users
SET name = 'nhuantd' WHERE id = 10