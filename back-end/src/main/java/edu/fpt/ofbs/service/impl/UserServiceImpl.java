package edu.fpt.ofbs.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import edu.fpt.ofbs.entities.Role;
import edu.fpt.ofbs.entities.User;
import edu.fpt.ofbs.models.CustomUserDetails;
import edu.fpt.ofbs.models.IUserDTO;
import edu.fpt.ofbs.repositories.UserRepository;
import edu.fpt.ofbs.service.RoleService;
import edu.fpt.ofbs.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserDetailsService, UserService{
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private RoleService roleService;

	@Override
	public List<User> findAll() {
		return userRepository.findAll();
	}

	@Override
	public User save(User user) {
		return userRepository.save(user);
	}

	@Override
	public User findByPhoneNumberLogin(String phoneNumber) {
		return userRepository.findByPhoneNumberLogin(phoneNumber);
	}
	
	@Override
	public Optional<User> findById(long id) {
		return userRepository.findById(id);
	}

	@Override
	public IUserDTO getUserProfileById(long userId) {
		return userRepository.getUserProfileById(userId);
	}
	
	@Override
	public User updateRoleProvider(User user) {
		Role role = roleService.findByName("ROLE_PROVIDER");
		
		user.setRole(role);
		user.setLastModified(new Date());
		
		return userRepository.save(user);
	}

	@Override
	public UserDetails loadUserByUsername(String phoneLogin) throws UsernameNotFoundException {
		// Kiểm tra xem user có tồn tại trong database không?
        User user = userRepository.findByPhoneNumberLogin(phoneLogin);
        if (user == null) {
            throw new UsernameNotFoundException(phoneLogin);
        }
        return new CustomUserDetails(user);
	}
	
	@Override
	public UserDetails loadUserById(long userId) throws UsernameNotFoundException {
		User user = userRepository.findById(userId).get();
		if (user == null) {
			throw new UsernameNotFoundException("not found user " + userId);
		}
		return new CustomUserDetails(user);
	}
	
	@Override
	public int getNumberOfUsersActive() {
		return userRepository.getNumberOfUsersActive();
	}
	
	@Override
	public void updateBalance(float balance, long userId) {
		userRepository.updateBalance(balance, userId);
	}
	
	@Override
	public User findByRole(Role role) {
		Role saveRole = new Role();
		saveRole = roleService.findByName(role.getName());
		
		return userRepository.findByRole(saveRole);
	}

	@Override
	public List<User> adminViewUsers(String phone, String name, String status) {
		return userRepository.adminViewUsers(phone, name, status);
	}

	@Override
	public void updateUserStatus(long userId, String status) {
		userRepository.updateUserStatus(userId, status);
	}
}
