package edu.fpt.ofbs.controllers;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.websocket.server.PathParam;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import edu.fpt.ofbs.entities.Role;
import edu.fpt.ofbs.entities.Status;
import edu.fpt.ofbs.entities.User;
import edu.fpt.ofbs.jwt.JwtTokenProvider;
import edu.fpt.ofbs.models.CustomUserDetails;
import edu.fpt.ofbs.models.IUserDTO;
import edu.fpt.ofbs.models.RegisterUserDTO;
import edu.fpt.ofbs.models.ResponseJwt;
import edu.fpt.ofbs.models.ResponseMessage;
import edu.fpt.ofbs.service.RoleService;
import edu.fpt.ofbs.service.StatusService;
import edu.fpt.ofbs.service.UserService;

@RestController
@CrossOrigin("*")
@RequestMapping("/users")
public class UserController {
	@Autowired
	private UserService userService;

	@Autowired
	private StatusService statusService;

	@Autowired
	private RoleService roleService;

	private PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenProvider tokenProvider;

	@GetMapping("")
	public ResponseEntity<?> getAllUsers() {
		List<User> user = userService.findAll();

		return ResponseEntity.status(HttpStatus.OK).body(user);
	}

	@GetMapping("/findByPhoneNumber/{phoneNumber}")
	public ResponseEntity<?> findByPhoneNumber(@PathVariable("phoneNumber") String phoneNumber) {
		User user = userService.findByPhoneNumberLogin(phoneNumber);
		return ResponseEntity.status(HttpStatus.OK).body(user);
	}

	@RequestMapping(value = "/update/{id}", method = RequestMethod.PATCH)
	public ResponseEntity<?> updateUserPassword(@PathVariable("id") long id, @RequestBody User user) {
		Optional<User> userOption = userService.findById(id);
		if (userOption.isPresent()) {
			User _user = userOption.get();
			_user.setPassword(passwordEncoder.encode(user.getPassword()));
			return new ResponseEntity<>(userService.save(_user), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}

	}

	@PostMapping("/login")
	public ResponseEntity<?> findUserLogin(@RequestBody User user) {
		User userLogin = userService.findByPhoneNumberLogin(user.getPhoneLogin());
		if (userLogin != null) {
			try {
				// Xác thực từ username và password.
				Authentication authentication = authenticationManager.authenticate(
						new UsernamePasswordAuthenticationToken(user.getPhoneLogin(), user.getPassword()));
				// Nếu không xảy ra exception tức là thông tin hợp lệ
				// Set thông tin authentication vào Security Context
				SecurityContextHolder.getContext().setAuthentication(authentication);

				// Trả về jwt cho người dùng.
				String jwt = tokenProvider.generateToken((CustomUserDetails) authentication.getPrincipal());

				return ResponseEntity.status(HttpStatus.OK).body(new ResponseJwt(userLogin, jwt));
			} catch (Exception e) {
				return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
			}
		}
		return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
	}

	@PostMapping("/register")
	public ResponseEntity<?> newUserRegister(@RequestBody RegisterUserDTO user) {
		User newUser = new User();
		if (user != null) {
			newUser.setPhoneLogin(user.getPhoneLogin());
			newUser.setName(user.getName());
			newUser.setPhoneNumber(user.getPhoneNumber());
			newUser.setPassword(passwordEncoder.encode(user.getPassword()));

			Status status = statusService.findStatusById(1);
			newUser.setStatus(status);

			Role role = roleService.findRoleById(3);
			newUser.setRole(role);

			newUser.setLastModified(new Date());
		}
		userService.save(newUser);
		return ResponseEntity.status(HttpStatus.OK).body(newUser);
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getUserProfileById(@PathParam("userId") long userId) {
		IUserDTO user = userService.getUserProfileById(userId);
		return ResponseEntity.status(HttpStatus.OK).body(user);
	}

	@PatchMapping("/profile/update")
	public ResponseEntity<?> updateUser(@PathParam("userId") long userId, @RequestBody User user) {
		Optional<User> userOption = userService.findById(userId);
		if (userOption.isPresent()) {
			User _user = userOption.get();

			_user.setName(user.getName());
			_user.setEmail(user.getEmail());

			if (user.getPhoneNumber() != null) {
				_user.setPhoneNumber(user.getPhoneNumber());
			}

			_user.setGender(user.isGender());
			_user.setDateOfBirth(user.getDateOfBirth());
			_user.setAddress(user.getAddress());
			_user.setLastModified(new Date());
			return new ResponseEntity<>(userService.save(_user), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}

	@GetMapping("/numberOfUsersActive")
	public ResponseEntity<?> getNumberOfUsersActive() {
		int numberOfUsersActive = userService.getNumberOfUsersActive();
		return ResponseEntity.status(HttpStatus.OK).body(numberOfUsersActive);
	}

	@PatchMapping("/updateRoleProvider")
	public ResponseEntity<?> updateRoleProvider(@RequestBody User user) {
		try {
			userService.updateRoleProvider(user);
			
			return ResponseEntity.status(HttpStatus.OK).body(user);
		}catch (Exception e) {
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage("Update role fail !"));
		}
	}
	
	@PatchMapping("/updateBalance")
	public ResponseEntity<?> updateBalance(@PathParam("balance") float balance, @PathParam("userId") long userId) {
		String message = "";

		try {
			userService.updateBalance(balance, userId);

			message = "Update balance successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not update balance !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
	
	@GetMapping("/findByRole")
	public ResponseEntity<?> findByRole(@PathParam("roleName") String roleName) {
		Role role = new Role();
		role.setName(roleName);
		
		User user = userService.findByRole(role);
		
		return ResponseEntity.status(HttpStatus.OK).body(user);
	}
	
	@GetMapping("/adminViewUsers")
	public ResponseEntity<?> adminViewUsers(@PathParam("phone") String phone, @PathParam("name") String name, @PathParam("status") String status) {
		if(phone == "" || phone == null) {
			List<User> users = userService.adminViewUsers(phone, name, status);
			
			return ResponseEntity.status(HttpStatus.OK).body(users);
		}else {
			String formatPhone = "+84" + phone.substring(1,phone.length());
			List<User> users = userService.adminViewUsers(formatPhone, name, status);
			
			return ResponseEntity.status(HttpStatus.OK).body(users);
		}
	}
	
	@PatchMapping("/updateUserStatus")
	public ResponseEntity<?> updateUserStatus(@PathParam("userId") long userId, @PathParam("status") String status) {
		String message = "";

		try {
			userService.updateUserStatus(userId, status);

			message = "Update user status successfully !";
			return ResponseEntity.status(HttpStatus.OK).body(new ResponseMessage(message));
		} catch (Exception e) {
			message = "Could not update user status !";
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new ResponseMessage(message));
		}
	}
}
