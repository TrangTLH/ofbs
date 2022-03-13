package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.Status;

public interface StatusService {

	Status findStatusById(long id);

	Status findStatusByName(String name);

	List<Status> getRestaurantStatus();

}
