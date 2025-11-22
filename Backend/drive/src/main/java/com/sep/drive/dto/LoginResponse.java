package com.sep.drive.dto;

public class LoginResponse {
    public String message;
    public String token;// to return a session token

    public LoginResponse(String message,String token) {
        this.message = message;
        this.token = token;
    }

    // Getters and Setters

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
