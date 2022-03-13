package edu.fpt.ofbs.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.BeanIds;
import org.springframework.security.authentication.AuthenticationManager;

import edu.fpt.ofbs.jwt.JwtAuthenticationFilter;
import edu.fpt.ofbs.service.impl.UserServiceImpl;

@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
	@Autowired
	UserServiceImpl userService;

	@Bean
	public JwtAuthenticationFilter jwtAuthenticationFilter() {
		return new JwtAuthenticationFilter();
	}

	@Bean(BeanIds.AUTHENTICATION_MANAGER)
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception {
		// Get AuthenticationManager bean
		return super.authenticationManagerBean();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		// Password encoder, để Spring Security sử dụng mã hóa mật khẩu người dùng
		return new BCryptPasswordEncoder();
	}
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userService) // Cung cáp userservice cho spring security
				.passwordEncoder(passwordEncoder()); // cung cấp password encoder
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.authorizeRequests().antMatchers("/users/login",
												"/users/register",
												"/users/update/**",
												"/users/findByPhoneNumber/**",
												"/images/**",
												"/notifications/**",
												"/payment/pay/**",
												"/users/findByRole").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/promotions/**").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/restaurants/**").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/dishes/**").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/feedbacks/getFeedbacksByRestaurantId").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/combos/**").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/services/**").permitAll();
		
		http.cors().and().csrf().disable()
		.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
				.and().authorizeRequests()
				.antMatchers("/users/profile", "/users/profile/**", "/orders/orderDetail/infor", "/orders/searchOrder", "/payment/pay", "/payment/history", "/payment/updateStatus", "/payment/save").hasAnyRole("PROVIDER", "CUSTOMER", "ADMIN")
				.antMatchers(HttpMethod.POST, "/restaurants").hasAnyRole("PROVIDER", "ADMIN")
				.antMatchers("/orders/updateStatus", "/orders/setStatus",
						"/orders/customer", "/restaurants/registerRestaurant", "/orders/insertOrderDetail", "/feedbacks/insertFeedback", "/orders/getOrderIdBeforeInsert").hasAnyRole("PROVIDER", "CUSTOMER")
				.antMatchers("/orders/getOrders", "/orders/getTotalOrderByStatus", "/feedbacks/updateStatusFeedback", "/feedbacks/getReport",
						"/dishes/updateStatus", "/combos/updateStatus", "/services/updateStatus", "/restaurants/getTotalRestaurantsByStatus",
						"/users/numberOfUsersActive", "users/adminViewUsers", "users/updateUserStatus").hasRole("ADMIN")
				.antMatchers(HttpMethod.POST, "/dishes").hasRole("PROVIDER")
				.antMatchers(HttpMethod.DELETE, "/dishes").hasRole("PROVIDER")
				.antMatchers("/combos/save", "/services/update", "/promotions/save").hasRole("PROVIDER")
				.antMatchers("/users/updateRoleProvider").hasRole("CUSTOMER")
				.antMatchers("/orders/restaurant").hasAnyRole("PROVIDER", "ADMIN")
				.anyRequest().authenticated();
		
		// Thêm một lớp Filter kiểm tra jwt
		http.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
	}
}
