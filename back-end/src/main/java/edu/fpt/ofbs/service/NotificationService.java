package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.Notification;
import edu.fpt.ofbs.models.INotificationDTO;

public interface NotificationService {

	Notification save(Notification notification);

	List<INotificationDTO> getNotifications(long customerId, long providerId, boolean isAdmin);

	Notification getNotificationById(long id);

}
