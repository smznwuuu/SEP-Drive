package com.sep.drive.userprofile;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Sort;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userRepository;

    private UserProfileService userService;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        userService = new UserProfileService(userRepository);
    }

    @Test
    public void testFindAllSort_WithFilter() {
        Sort sort = Sort.by(Sort.Direction.DESC, "totalRides");
        String filter = "DRIVER";

        List<UserDTO> mockList = Arrays.asList(
                new UserDTO("driver1", "Ali", "Meier", 100.0, 4.5, 30.0, 20, 300.0, "Ali Meier"),
                new UserDTO("driver2", "Lea", "Schmidt", 80.0, 4.7, 28.0, 18, 250.0, "Lea Schmidt")
        );

        when(userRepository.findAllSortWithFilter(sort, filter)).thenReturn(mockList);

        List<UserDTO> result = userService.findAllSort("totalRides", "desc", filter);

        assertEquals(2, result.size());
        assertEquals("driver1", result.get(0).getUsername());
        assertEquals("driver2", result.get(1).getUsername());
        verify(userRepository).findAllSortWithFilter(sort, filter);
    }

    @Test
    public void testFindAllSort_WithoutFilter() {
        Sort sort = Sort.by(Sort.Direction.ASC, "rating");

        List<UserDTO> mockList = Arrays.asList(
                new UserDTO("driver3", "Max", "Müller", 120.0, 4.3, 35.0, 25, 320.0, "Max Müller")
        );

        when(userRepository.findAllSort(sort)).thenReturn(mockList);

        List<UserDTO> result = userService.findAllSort("rating", "asc", null);

        assertEquals(1, result.size());
        assertEquals("driver3", result.get(0).getUsername());
        verify(userRepository).findAllSort(sort);
    }

    @Test
    public void testFindAllSort_EmptyResult() {
        Sort sort = Sort.by(Sort.Direction.DESC, "totalEarned");

        when(userRepository.findAllSort(sort)).thenReturn(Collections.emptyList());

        List<UserDTO> result = userService.findAllSort("totalEarned", "desc", null);

        assertTrue(result.isEmpty());
        verify(userRepository).findAllSort(sort);
    }
}
