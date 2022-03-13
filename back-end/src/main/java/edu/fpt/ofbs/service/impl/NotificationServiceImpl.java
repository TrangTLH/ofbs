package edu.fpt.ofbs.service.impl;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.fpt.ofbs.entities.Notification;
import edu.fpt.ofbs.models.INotificationDTO;
import edu.fpt.ofbs.repositories.NotificationRepository;
import edu.fpt.ofbs.service.NotificationService;

@Service
public class NotificationServiceImpl implements NotificationService{
	@Autowired
	private NotificationRepository notificationRepository;
	
	@Override
	public Notification save(Notification notification) {
		if(notification.getDate() == null) {
			notification.setDate(new Date());
		}
		
		return notificationRepository.save(notification);
	}
	
	@Override
	public List<INotificationDTO> getNotifications(long customerId, long providerId, boolean isAdmin) {
		return notificationRepository.getNotifications(customerId, providerId, isAdmin);
	}
	
	@Override
	public Notification getNotificationById(long id) {
		return notificationRepository.findById(id).get();
	}
}
