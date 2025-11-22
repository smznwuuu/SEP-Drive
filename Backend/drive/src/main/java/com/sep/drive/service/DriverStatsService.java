package com.sep.drive.service;

import com.sep.drive.CompletedRequest.CompletedRequest;
import com.sep.drive.CompletedRequest.CompletedRequestRepository;
import com.sep.drive.dto.DriverStatResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class DriverStatsService {

    private final CompletedRequestRepository repository;

    public DriverStatsService(CompletedRequestRepository repository) {
        this.repository = repository;
    }
    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }


    public List<DriverStatResponse> getMonthlyStats(long driverId, int year) {
        List<CompletedRequest> rides = repository.findByDId(driverId);
        List<DriverStatResponse> stats = new ArrayList<>();

        double[] income = new double[12];
        double[] distance = new double[12];
        double[] duration = new double[12];
        double[] ratingSum = new double[12];
        int[] count = new int[12];

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

        for (CompletedRequest ride : rides) {
            LocalDateTime date = LocalDateTime.parse(ride.getTime(), formatter);
            if (date.getYear() == year) {
                int i = date.getMonthValue() - 1;
                income[i] += ride.getPrice();
                distance[i] += ride.getDistance();
                duration[i] += ride.getDuration();
                ratingSum[i] += ride.getRatingFromCustomer();
                count[i]++;
            }
        }

        for (int i = 0; i < 12; i++) {
            double avg = count[i] > 0 ? ratingSum[i] / count[i] : 0;
            stats.add(new DriverStatResponse(
                    i + 1,
                    round(income[i]),
                    round(distance[i]),
                    round(duration[i]),
                    round(avg)
            ));

        }

        return stats;
    }

    public List<DriverStatResponse> getDailyStats(long driverId, int year, int month) {
        List<CompletedRequest> rides = repository.findByDId(driverId);
        List<DriverStatResponse> stats = new ArrayList<>();

        //  Anzahl tatsächlicher Tage im Monat bestimmen
        int daysInMonth = YearMonth.of(year, month).lengthOfMonth();

        double[] income = new double[daysInMonth];
        double[] distance = new double[daysInMonth];
        double[] duration = new double[daysInMonth];
        double[] ratingSum = new double[daysInMonth];
        int[] count = new int[daysInMonth];

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

        for (CompletedRequest ride : rides) {
            LocalDateTime date = LocalDateTime.parse(ride.getTime(), formatter);
            if (date.getYear() == year && date.getMonthValue() == month) {
                int i = date.getDayOfMonth() - 1;
                income[i] += ride.getPrice();
                distance[i] += ride.getDistance();
                duration[i] += ride.getDuration();
                ratingSum[i] += ride.getRatingFromCustomer();
                count[i]++;
            }
        }

        //  Alle Tage zurückgeben – auch die mit 0 Werten
        for (int i = 0; i < daysInMonth; i++) {
            double avg = count[i] > 0 ? ratingSum[i] / count[i] : 0;
            stats.add(new DriverStatResponse(
                    i + 1,
                    round(income[i]),
                    round(distance[i]),
                    round(duration[i]),
                    round(avg)
            ));

        }

        return stats;
    }
}


