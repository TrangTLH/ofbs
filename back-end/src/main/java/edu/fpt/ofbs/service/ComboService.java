package edu.fpt.ofbs.service;

import java.util.List;

import edu.fpt.ofbs.entities.Combo;
import edu.fpt.ofbs.models.IComboDTO;

public interface ComboService {
	List<IComboDTO> getCombosByRestaurantId(long restaurantId, boolean isActive);
	
	Combo getComboById(long id);
	
	void saveCombo(Combo combo);
	
	void updateStatus(long comboId);
	
	int checkCombo(long comboId);
}
