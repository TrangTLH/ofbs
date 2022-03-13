package edu.fpt.ofbs.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.fpt.ofbs.entities.ServiceCategory;
import edu.fpt.ofbs.entities.Services;
import edu.fpt.ofbs.models.IServiceDTO;
import edu.fpt.ofbs.repositories.ServiceCategoryRepository;
import edu.fpt.ofbs.repositories.ServiceRepository;
import edu.fpt.ofbs.service.ServiceService;
import edu.fpt.ofbs.service.StatusService;

@Service
@Transactional
public class ServiceServiceImpl implements ServiceService{
	@Autowired
	private ServiceRepository serviceRepository;
	
	@Autowired
	private ServiceCategoryRepository categoryRepository;

	@Autowired
	private StatusService statusService;
	
	@Override
	public List<Services> findAll() {
		return serviceRepository.findAll();
	}

	@Override
	public Services findServiceById(long id) {
		return serviceRepository.findById(id).get();
	}

	@Override
	public List<IServiceDTO> getServicesByRestaurantId(long restaurant_id, long category_id){
		return serviceRepository.getServicesByRestaurantId(restaurant_id, category_id);
	}
	
	@Override
	public List<IServiceDTO> searchServices(long restaurant_id, String serviceName, String category){
		return serviceRepository.searchServices(restaurant_id, serviceName, category);
	}
	
	@Override
	public void updateService(Services service) {
		serviceRepository.save(service);
	}
	
	@Override
	public List<ServiceCategory> getAllServiceCategory() {
		return categoryRepository.findAll();
	}
	
	@Override
	public void updateStatus(long serviceId) {
		long statusId = statusService.findStatusByName("banned").getId();
		serviceRepository.updateStatus(statusId, serviceId);
	}
}
