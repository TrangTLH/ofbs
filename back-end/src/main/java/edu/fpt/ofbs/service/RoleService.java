package edu.fpt.ofbs.service;

import edu.fpt.ofbs.entities.Role;

public interface RoleService {

	Role findRoleById(long id);

	Role findByName(String name);

}
