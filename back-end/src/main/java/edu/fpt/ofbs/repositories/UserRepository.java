package edu.fpt.ofbs.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import edu.fpt.ofbs.entities.Role;
import edu.fpt.ofbs.entities.User;
import edu.fpt.ofbs.models.IUserDTO;

@Repository
public interface UserRepository extends JpaRepository<User, Long>{
	@Query(value = "exec sp_findByPhoneNumber ?1", nativeQuery = true)
	User findByPhoneNumberLogin(String phoneNumber);
	
	@Query(value = "exec sp_getUserProfileById ?1", nativeQuery = true)
	IUserDTO getUserProfileById(long userId);
	
	@Query(value = "select count(u.id) as numberOfUsersActive\r\n"
			+ "from users u\r\n"
			+ "join status s on u.status_id = s.id\r\n"
			+ "join roles r on u.role_id = r.id\r\n"
			+ "where s.name = 'active'\r\n"
			+ "	and (r.name = 'ROLE_CUSTOMER' or r.name = 'ROLE_PROVIDER')", nativeQuery = true)
	int getNumberOfUsersActive();
	
	@Modifying
	@Query(value = "UPDATE users\r\n"
			+ "   SET \r\n"
			+ "      balance = ?1\r\n"
			+ " WHERE id = ?2", nativeQuery = true)
	void updateBalance(float balance, long userId);
	
	User findByRole(Role role);
	
	@Query(value = "exec sp_adminViewUsers ?1, ?2, ?3", nativeQuery = true)
	List<User> adminViewUsers(String phone, String name, String status);
	
	@Modifying
	@Query(value = "exec sp_updateUserStatus ?1, ?2", nativeQuery = true)
	void updateUserStatus(long userId, String status);
}
