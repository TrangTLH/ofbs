package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.ServiceCategory;
import edu.fpt.ofbs.entities.Services;
import edu.fpt.ofbs.models.IServiceDTO;

public interface ServiceService {

	List<Services> findAll();

	Services findServiceById(long id);

	List<IServiceDTO> getServicesByRestaurantId(long restaurant_id, long category_id);

	List<IServiceDTO> searchServices(long restaurant_id, String serviceName, String category);

	void updateService(Services service);

	List<ServiceCategory> getAllServiceCategory();

	void updateStatus(long serviceId);

}
