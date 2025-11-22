package com.sep.drive.userprofile;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserProfileService {
    private final UserProfileRepository userRepository;

    public UserProfileService(UserProfileRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User findById(long id) {
        User user = userRepository.findByid(id);
        if(user != null){
            System.out.println("User found");
            return user;
        }
        else {
            System.out.println("User not found");
            return null;
        }
    }

    public void save(User user) {

        userRepository.save(user);
    }
    public boolean userExists(String username) {
        return userRepository.findByUsername(username) != null;
        }
//    public String getCurrUsername() {
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        if(auth != null && auth.isAuthenticated()) {
//            return auth.getName();
//        }
//        return null;
//    }

    public User findUserById(long id) {
        return userRepository.findUserById(id);
    }

    public MergeName searchFullNameById(long id) {
        return userRepository.findFullNameById(id);
    }

    public String findRoleByUsername(String username) {
        return userRepository.findRoleByUsername(username);
    }

    public List<UserDTO> findAllSort(String sortBy, String order, String filter) {
        Sort sort = Sort.unsorted();
        if (sortBy != null && !sortBy.isEmpty() && order != null && !order.isEmpty()) {
            Sort.Direction direction = Sort.Direction.fromString(order.toUpperCase());
            sort = Sort.by(direction, sortBy);

        }
        if (filter != null && !filter.isEmpty()) {
            return userRepository.findAllSortWithFilter(sort, filter);
        } else {
            return userRepository.findAllSort(sort);
        }
    }


    public UserDTO findUserDTOById(long id) {
        return userRepository.findbyIDdto(id);
    }
    public UserDTO findUserDTOByUsername(String username) {
        return userRepository.findbyUsernamedto(username);
    }

}

