package com.sep.drive.dto;

public class RegisterResponse {
    private String message;
    private boolean requiresTwoFactor;
    private String username;

    public RegisterResponse(String message, boolean requiresTwoFactor, String username) {
        this.message = message;
        this.requiresTwoFactor = requiresTwoFactor;
        this.username = username;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRequiresTwoFactor() {
        return requiresTwoFactor;
    }

    public void setRequiresTwoFactor(boolean requiresTwoFactor) {
        this.requiresTwoFactor = requiresTwoFactor;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
