package com.sep.drive.controller;

import com.sep.drive.dto.*;
import com.sep.drive.userprofile.User;
import com.sep.drive.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController  // This class will handle HTTP requests
@RequestMapping("/api/auth")  // All URLs will start with /api/auth
public class AuthController {

    private final UserService userService;

    // Constructor to inject UserService
    public AuthController(UserService userService) {
        this.userService = userService;
    }

    //  Updated return type to RegisterResponse
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> registerUser(@RequestBody RegisterUserRequest request) {
        RegisterResponse response = userService.registerUser(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = userService.loginUser(request);
        return ResponseEntity.ok(response);
    }
    @PostMapping("/login/code")
    public ResponseEntity<String> generate2FACode(@RequestBody LoginRequest request) {
        userService.verifyPasswordAndSendCode(request);
        return ResponseEntity.ok("Verification code sent to your email.");
    }
    @PostMapping("/verify-code")
    public ResponseEntity<String> verifyCode(@RequestBody VerifyCodeRequest request) {
        userService.verifyCode(request.getUsername(), request.getCode());
        return ResponseEntity.ok("Verification successful. You can now log in.");
    }
    @PostMapping("/upload/profile-picture")
    public ResponseEntity<Map<String, String>> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            String uploadDir = "uploads/profile-pictures/";
            Files.createDirectories(Paths.get(uploadDir));

            String originalFilename = file.getOriginalFilename();
            String newFilename = System.currentTimeMillis() + "_" + originalFilename;
            Path filePath = Paths.get(uploadDir, newFilename);

            Files.write(filePath, file.getBytes());

            String fileUrl = "http://localhost:8080/uploads/profile-pictures/" + newFilename;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Upload failed"));
        }
    }




}
