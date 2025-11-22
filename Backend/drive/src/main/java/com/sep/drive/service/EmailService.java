package com.sep.drive.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    //  Send login notification
    public void sendLoginNotification(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Login Successful");
        message.setText("Hello " + name + ",\n\nYou have logged in successfully to your Drive account.");

        mailSender.send(message);
    }

    //  Send 2FA verification code
    public void sendVerificationCode(String to, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Your 2FA Verification Code");
        message.setText("Your verification code is: " + code);

        mailSender.send(message);
    }
}

