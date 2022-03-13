package edu.fpt.ofbs.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.fpt.ofbs.entities.Combo;
import edu.fpt.ofbs.models.IComboDTO;
import edu.fpt.ofbs.repositories.ComboRepository;
import edu.fpt.ofbs.service.ComboService;
import edu.fpt.ofbs.service.StatusService;

@Service
@Transactional
public class ComboServiceImpl implements ComboService{
	
	@Autowired
	private ComboRepository comboRepository;
	
	@Autowired
	private StatusService statusService;
	
	@Override
	public List<IComboDTO> getCombosByRestaurantId(long restaurantId, boolean isActive){
		return comboRepository.getCombosByRestaurantId(restaurantId, isActive);
	}
	
	@Override
	public Combo getComboById(long id) {
		return comboRepository.findById(id).get();
	}
	
	@Override
	public void saveCombo(Combo combo) {
		comboRepository.save(combo);
	}
	
	@Override
	public void updateStatus(long comboId) {
		long statusId = statusService.findStatusByName("banned").getId();
		comboRepository.updateStatus(statusId, comboId);
	}

	@Override
	public int checkCombo(long comboId) {
		return comboRepository.checkCombo(comboId);
	}
}
