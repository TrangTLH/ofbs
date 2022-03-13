package edu.fpt.ofbs.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import edu.fpt.ofbs.entities.Role;
import edu.fpt.ofbs.entities.User;
import edu.fpt.ofbs.models.IUserDTO;

public interface UserService {

	List<User> findAll();

	User save(User user);

	User findByPhoneNumberLogin(String phoneNumber);

	Optional<User> findById(long id);

	IUserDTO getUserProfileById(long userId);

	User updateRoleProvider(User user);

	UserDetails loadUserById(long userId) throws UsernameNotFoundException;

	int getNumberOfUsersActive();

	void updateBalance(float balance, long userId);

	User findByRole(Role role);

	List<User> adminViewUsers(String phone, String name, String status);
	
	void updateUserStatus(long userId, String status);
}
