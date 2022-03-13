package edu.fpt.ofbs.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.Notification;
import edu.fpt.ofbs.models.INotificationDTO;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>{
	@Query(value = "exec sp_getNotifications ?1, ?2, ?3", nativeQuery = true)
	List<INotificationDTO> getNotifications(long customerId, long providerId, boolean isAdmin);
}
