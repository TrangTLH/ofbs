package edu.fpt.ofbs.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.fpt.ofbs.entities.Status;
import edu.fpt.ofbs.repositories.StatusRepository;
import edu.fpt.ofbs.service.StatusService;

@Service
public class StatusServiceImpl implements StatusService{
	@Autowired
	private StatusRepository statusRepository;
	
	@Override
	public Status findStatusById(long id) {
		return statusRepository.findById(id).get();
	}
	
	@Override
	public Status findStatusByName(String name) {
		return statusRepository.findByName(name);
	}
	
	@Override
	public List<Status> getRestaurantStatus(){
		List<Status> list = new ArrayList<Status>();
		
		list.add(findStatusByName("active"));
		list.add(findStatusByName("inactive"));
		list.add(findStatusByName("pending"));
		return list;
	}
}
