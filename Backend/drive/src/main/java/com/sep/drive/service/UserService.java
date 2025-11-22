package com.sep.drive.service;

import com.sep.drive.dto.LoginRequest;
import com.sep.drive.dto.LoginResponse;
import com.sep.drive.dto.RegisterResponse;
import com.sep.drive.dto.RegisterUserRequest;
import com.sep.drive.userprofile.User;
import com.sep.drive.exceptions.DuplicateResourceException;
import com.sep.drive.userprofile.Role;
import com.sep.drive.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service  // Tells Spring Boot this is a Service class
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private static final String SUPER_CODE = "999999";  // supercode
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    // Constructor to inject UserRepository and PasswordEncoder
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    public RegisterResponse registerUser(RegisterUserRequest request) {

        // Check if the username is already taken
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new DuplicateResourceException("Username already exists");
        }

        // Check if the email is already taken
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new DuplicateResourceException("Email already exists");
        }

        // Create new User object
        User user = new User();
        user.setUsername(request.getUsername());
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        user.setEmail(request.getEmail());
        user.setBirthdate(request.getBirthDate());
        user.setRole(request.getRole());

        user.setRole(request.getRole());

        if (request.getRole() == Role.DRIVER) {
            user.setCarClass(request.getCarClass());
        } else {
            user.setCarClass(null);  // Not applicable to CUSTOMER
        }




        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // Set the profile picture if provided
        user.setProfilepicture(request.getProfilePicture());

        //  Save user without 2FA code first
        user = userRepository.save(user);

        // Generate 2FA code with expiration
        String randomCode = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(randomCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));

        userRepository.save(user);  // Save user again with code + expiry

         // Send email
        emailService.sendVerificationCode(user.getEmail(), randomCode);


        return new RegisterResponse(
                "Registered successfully. 2FA code sent to your email.",
                true,
                user.getUsername()
        );

    }
    public void verifyPasswordAndSendCode(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        // Generate random 6-digit code
        String randomCode = String.format("%06d", new Random().nextInt(999999));
        user.setVerificationCode(randomCode);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);


        emailService.sendVerificationCode(user.getEmail(), randomCode);
    }



    public LoginResponse loginUser(LoginRequest request) {
        // Find user
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check password
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }
        //  Block unverified users
        if (!user.isVerified()) {
            throw new IllegalArgumentException("Please verify your email before logging in.");
        }

        // Check 2FA code
        if (!isValidCode(user, request.getVerificationCode())) {
            throw new IllegalArgumentException("Invalid verification code");
        }
        user.setVerificationCode(null);  // Clear the used code
        userRepository.save(user);  // Update the user in the database

        //Send email notification
        emailService.sendLoginNotification(user.getEmail(), user.getFirstname());

        String userToken = user.getId() + " " +user.getRole().name() + " " + user.getFirstname() + user.getLastname() + "Token" + " " + user.getUsername();
        return new LoginResponse("Login successful!",userToken);
    }
    public void verifyCode(String username, String code) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (code == null) {
            throw new IllegalArgumentException("Verification code is required.");
        }

        //  Accept super code for verification
        if (SUPER_CODE.equals(code)) {
            user.setVerificationCode(null);
            user.setVerificationCodeExpiresAt(null);
            user.setVerified(true);
            userRepository.save(user);
            return;
        }

        if (user.getVerificationCode() == null) {
            throw new IllegalArgumentException("No verification code found. Please request a new one.");
        }

        if (!code.equals(user.getVerificationCode())) {
            throw new IllegalArgumentException("Incorrect verification code.");
        }

        if (user.getVerificationCodeExpiresAt() == null ||
                user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code expired.");
        }

        //  Normal flow: valid and not expired
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        user.setVerified(true);
        userRepository.save(user);
    }



    private boolean isValidCode(User user, String code) {
        if (code == null) return false;

        // Super code always works
        if (SUPER_CODE.equals(code)) return true;

        // Otherwise, check if it matches the user's own code
        return code.equals(user.getVerificationCode());
    }




}
