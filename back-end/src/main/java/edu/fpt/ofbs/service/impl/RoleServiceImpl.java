package edu.fpt.ofbs.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import edu.fpt.ofbs.entities.Role;
import edu.fpt.ofbs.repositories.RoleRepository;
import edu.fpt.ofbs.service.RoleService;

@Service
public class RoleServiceImpl implements RoleService{
	@Autowired
	private RoleRepository roleRepository;
	
	@Override
	public Role findRoleById(long id) {
		return roleRepository.findById(id).get();
	}
	
	@Override
	public Role findByName(String name) {
		return roleRepository.findByName(name);
	}
}
