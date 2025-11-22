package com.sep.drive.service;

import com.sep.drive.repository.UserRepository;
import com.sep.drive.userprofile.User;
import org.springframework.stereotype.Service;

@Service
public class RatingService {

    private final UserRepository userRepository;

    public RatingService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public void addNewRating(User user, int score) {
        if (score < 1 || score > 5) {
            throw new IllegalArgumentException("Score must be between 1 and 5.");
        }

        int count = user.getRatingCount();
        double currentAvg = user.getRating();
        double newAvg = ((currentAvg * count) + score) / (count + 1);

        user.setRating(newAvg);
        user.setRatingCount(count + 1);

        userRepository.save(user);
    }
}
