USE [OFBS]
GO
/****** Object:  Table [dbo].[service_categories]    Script Date: 6/11/2021 10:37:38 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[service_categories](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [nvarchar](255) NOT NULL,
 CONSTRAINT [PK_service_categories] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO
ALTER TABLE [dbo].[services]
ADD [service_category_id] [int] NOT NULL;

GO
SET IDENTITY_INSERT [dbo].[service_categories] ON 

INSERT [dbo].[service_categories] ([id], [name]) VALUES (1, N'Trang trí')
INSERT [dbo].[service_categories] ([id], [name]) VALUES (2, N'Ban nhạc')
INSERT [dbo].[service_categories] ([id], [name]) VALUES (3, N'Vũ đoàn')
INSERT [dbo].[service_categories] ([id], [name]) VALUES (4, N'Ca sĩ')
INSERT [dbo].[service_categories] ([id], [name]) VALUES (5, N'MC')
INSERT [dbo].[service_categories] ([id], [name]) VALUES (6, N'Quay phim - chụp ảnh')
INSERT [dbo].[service_categories] ([id], [name]) VALUES (7, N'Xe cưới')
SET IDENTITY_INSERT [dbo].[service_categories] OFF
GO
SET IDENTITY_INSERT [dbo].[services] ON 

INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (1, N'Combo trang trí bàn Gallery 1', N'Combo giá trọn gói bao gồm:\n 
- Khu vực chụp hình hoa lá lụa cao cấp
\n- Bàn Gallery hoa lụa
\n- Thùng tiền
\nVới màu sắc hài hòa và tươi tắn, phong cách này rất hợp cho những cặp đôi có tình yêu lãng mạn và say đắm.', 1, 5500000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (4, N'Combo trang trí bàn Gallery 2', N'Tông màu xanh coban\n

Màu xanh coban luôn tạo được ấn tượng mạnh với quan khách tham dự tiệc cưới.\n

Với tông màu khác biệt và hiện đại này, phong cách này mong muốn mang đến cho bạn một làn gió mới trong thiết kế bàn Gallery.', 1, 950000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (5, N'Combo trang trí bàn Gallery 3', N'Phong cách boho\n
Lấy cảm hứng từ cuộc sống tự do và phòng khoáng của người dân du mục phương Tây, phong cách Boho chiếm spotlight của mọi ánh nhín trong hôn lễ bởi sự mới mẻ.\n

Không gian ngoài trời thoáng đãng là lý tưởng nhất để tổ chức tiệc cưới.\n

Những dãy đèn được thắp lên thật ấm áp mang lại không gian lãng mạn cho cặp đôi.', 1, 950000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (6, N'Trang trí background chụp ảnh mẫu 1', N'Việc thiết kế một tấm background với kiểu dáng thú vị, ghi dấu ấn để tạo phong cách riêng là điều mà nhiều cặp đôi hướng tới, background được thiết kế tinh tế sẽ giúp cho khu vực đón khách thêm lung linh và rực rỡ, tạo nên những bức ảnh đẹp trong ngày trọng đại của cuộc đời.', 1, 5000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (7, N'Trang trí background chụp ảnh mẫu 2', N'Việc thiết kế một tấm background với kiểu dáng thú vị, ghi dấu ấn để tạo phong cách riêng là điều mà nhiều cặp đôi hướng tới, background được thiết kế tinh tế sẽ giúp cho khu vực đón khách thêm lung linh và rực rỡ, tạo nên những bức ảnh đẹp trong ngày trọng đại của cuộc đời.', 1, 5000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (8, N'Trang trí background chụp ảnh mẫu 3', N'Việc thiết kế một tấm background với kiểu dáng thú vị, ghi dấu ấn để tạo phong cách riêng là điều mà nhiều cặp đôi hướng tới, background được thiết kế tinh tế sẽ giúp cho khu vực đón khách thêm lung linh và rực rỡ, tạo nên những bức ảnh đẹp trong ngày trọng đại của cuộc đời.', 1, 5000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (9, N'Trang trí lối đi sân khấu mẫu 1', N'Trong một tiệc cưới, giây phút được mọi người mong đợi nhất là khi cô dâu chú rể rạng rỡ sánh đôi cùng nhau bước đi giữa hai hàng quan khách để tiến tới nơi cử hành hôn lễ. Khoảnh khắc cô dâu chú rể bước trên con đường lộng lẫy, hướng tới sân khấu tổ chức lễ thành hôn sẽ được lưu giữ trong những bức ảnh kỷ niệm và là hình ảnh đáng nhớ nhất.', 1, 5000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (10, N'Trang trí lối đi sân khấu mẫu 2', N'Trong một tiệc cưới, giây phút được mọi người mong đợi nhất là khi cô dâu chú rể rạng rỡ sánh đôi cùng nhau bước đi giữa hai hàng quan khách để tiến tới nơi cử hành hôn lễ. Khoảnh khắc cô dâu chú rể bước trên con đường lộng lẫy, hướng tới sân khấu tổ chức lễ thành hôn sẽ được lưu giữ trong những bức ảnh kỷ niệm và là hình ảnh đáng nhớ nhất.', 1, 5000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (11, N'Trang trí Bánh kem - Tháp rượu', N'Trong các ngày cưới hỏi, nghi thức làm lễ cứơi chiếm vai trò rẩt quan trọng. Nó đánh dấu một bứơc ngặt mới cho các cặp đôi, từ đó họ sẽ chính thức được nên vợ nên chồng. Nghi thức cùng nhau cắt bánh kem và rót rượu mang ý nghĩa là hai người sẽ cùng nhau làm mọi việc bắt đầu từ giây phút này, cùng với đó những dòng rượu sâm banh màu đỏ rực rỡ thể hiện thêm tình yêu nồng ấm của đôi vợ chồng mới cưới.', 1, 2000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (12, N'Ban nhạc điện tử', N'Ban nhạc điện tử', 1, 2000000, 30, 2)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (13, N'Ban nhạc acoustic', N'Ban nhạc acoustic', 1, 2000000, 30, 2)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (14, N'Vũ đoàn', N'Điệu nhảy là một phần trong cuộc sống của chúng ta. Những vũ đạo chuyên nghiệp kết hợp với cảm xúc, cách thể hiện của người trình diễn sẽ tạo nên một điệu nhảy đẹp. Tùy vào từng bài hát, người thưởng thức buổi diễn sẽ được truyền đến những cảm xúc khác nhau phù hợp với không gian nơi đó. Đặc biệt trong tiệc cưới, những điệu múa uyển chuyển, mềm mại dịch vụ cung cấp vũ đoàn là không thể thiếu. Nó góp phần tạo nên sự ý vị của buổi tiệc vui.', 1, 1000000, 30, 3)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (15, N'Ca sĩ phổ thông', N'Ca sĩ là một yếu tố không thể thiếu cho một đám cưới', 1, 800000, 30, 4)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (17, N'Ca sĩ hát tiếng Anh', N'Ca sĩ hát tiếng Anh', 1, 1000000, 30, 4)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (18, N'MC phổ thông', N'Việc tổ chức một sự kiện diễn ra thành công tốt đẹp phụ thuộc vào rất nhiều yếu tố, một trong những yếu tố góp phần quan trọng vào sự thành công là MC – hoạt náo viên. Vì vậy, một đội ngũ MC chuyên nghiệp là rất cần thiết cho một lễ cưới. ', 1, 800000, 30, 5)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (19, N'MC song ngữ Việt - Anh', N'Việc tổ chức một sự kiện diễn ra thành công tốt đẹp phụ thuộc vào rất nhiều yếu tố, một trong những yếu tố góp phần quan trọng vào sự thành công là MC – hoạt náo viên. Vì vậy, một đội ngũ MC chuyên nghiệp là rất cần thiết cho một lễ cưới. ', 1, 1000000, 30, 5)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (20, N'Quay phim - chụp ảnh ', N'Đám cưới là khoảnh khắc tuyệt đẹp của đời người, khi cô gái bỗng hóa thành nàng công chúa lộng lẫy trong bộ váy cưới quyến rũ, kiêu sa sánh bước bên cạnh cùng chàng hoàng tử lịch lãm. Trong khi chụp ảnh cưới hay tiệc cưới, những hình ảnh ngọt ngào của cô dâu chú rể được nhiếp ảnh gia vô tình "bắt" lấy, tất cả những hình ảnh đẹp ấy sẽ giúp uyên ương nhớ lại thời khắc hạnh phúc mỗi khi xem lại. Phong cách sôi động, trẻ trung hay lãng mạn, đầy cảm xúc đều được tái hiện trên bộ ảnh một cách đầy tính nghệ thuật, với những góc quay mang đậm phong cách riêng. ', 1, 3000000, 30, 6)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (21, N'Xe cưới mẫu 1', N'Nhiều sự lựa chọn về dịch vụ, kiểu dáng, thương hiệu, loại xe cũng như luôn có mức giá thuê xe tốt nhất.', 1, 500000, 30, 7)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (22, N'Xe cưới mẫu 2', N'Nhiều sự lựa chọn về dịch vụ, kiểu dáng, thương hiệu, loại xe cũng như luôn có mức giá thuê xe tốt nhất.', 1, 500000, 30, 7)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (23, N'Xe cưới mẫu 3 ', N'Nhiều sự lựa chọn về dịch vụ, kiểu dáng, thương hiệu, loại xe cũng như luôn có mức giá thuê xe tốt nhất.', 1, 500000, 30, 7)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (24, N'Trang trí trọn gói Rustic Wedding', N'Tuy xuất hiện ở các tiệc cưới phương Tây từ rất lâu nhưng mãi cho đến sau này thì hình thức trang trí tiệc cưới theo phong cách Mộc hay còn gọi là Rustic Wedding mới thật sự được ứng dụng nhiều ở các tiệc cưới Việt Nam. Rustic wedding phải lấy ý tưởng từ thiên nhiên, mộc mạc, từ sự hoang sơ đưa vào vẻ sang trọng và hiện đại cần phải có của đám cưới. Các vật liệu bằng gỗ, cành cây khô kết hợp với lồng đèn thường được sử dụng trong trang trí theo chủ đề Mộc.
 ', 1, 30000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (25, N'Trang trí trọn gói Wonder of the sea', N'Màu xanh tươi mát của biển luôn đầy sức quyến rũ, đem lại cảm giác thư thái, thoải mái cho con người, giúp bao mệt mỏi, bực dọc như tan biến. Bạn có từng ước ao được hòa mình vào không khí đó bao giờ chưa?
Đối với những ai yêu thích biển, bị mê hoặc bởi tiếng sóng rì rào mà không có cơ duyên tổ chức tiệc cưới tại bờ cát trắng trước biển thì bạn có thể yên tâm, trang trí lễ cưới với chủ đề biển sẽ đáp ứng mong muốn của bạn.
Nhiều hình ảnh vui nhộn liên quan đến biển cùng tông màu xanh dương sẽ được dùng trang trí cho tiệc cưới. Bạn sẽ cảm nhận được không gian như bạn đang đứng ngay trên bãi biển vậy.', 1, 30000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (26, N'Trang trí trọn gói Beautiful In White ', N'Sắc trắng – màu sắc kinh điển cho đám cưới, đây cũng là màu được sử dụng nhiều nhất trong hôn lễ. Không gian cưới với sắc trắng tinh tế, cổ điển kết hợp với các phụ kiện pha lê, thủy tinh không kém  phần sang trọng. Hoa hồng trắng, lưu ly, lan trắng điểm tô cho từng góc tiệc, không hoa mỹ như những màu sắc khác nhưng vẫn giữ cho mình vẻ đơn sơ,  thuần khiết, tuy đơn giản nhưng mang lại hiệu quả không ngờ.', 1, 30000000, 30, 1)
INSERT [dbo].[services] ([id], [name], [description], [status_id], [price], [restaurant_id], [service_category_id]) VALUES (27, N'Trang trí cổng hoa', N'Trang trí cổng hoa theo sự lựa chọn của khách hàng', 1, 2000000, 30, 1)
SET IDENTITY_INSERT [dbo].[services] OFF
GO
ALTER TABLE [dbo].[services]  WITH CHECK ADD  CONSTRAINT [PK_service_category] FOREIGN KEY([service_category_id])
REFERENCES [dbo].[service_categories] ([id])
GO
ALTER TABLE [dbo].[services] CHECK CONSTRAINT [PK_service_category]
GO
