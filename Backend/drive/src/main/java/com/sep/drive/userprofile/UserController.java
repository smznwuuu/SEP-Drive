package com.sep.drive.userprofile;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/users")
public class UserController {
    private final UserProfileService userService;
    //

    public UserController(UserProfileService userService) {
        this.userService = userService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user != null) {
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            //
        }
    }
    @GetMapping("/exists/{username}")
    public ResponseEntity<Boolean> getUserExist(@PathVariable String username) {
        boolean exists = userService.userExists(username);
        return new ResponseEntity<>(exists, HttpStatus.OK);

    }
//    @GetMapping("/curr-username")
//    public ResponseEntity<String> getCurrLoggedInUsername() {
//        String currUsername = userService.getCurrUsername();
//        if (currUsername != null) {
//            return new ResponseEntity<>(currUsername, HttpStatus.OK);
//        } else {
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//        }
//    }


    @PostMapping
    public ResponseEntity<Void> addUser(@RequestBody User user) {
        userService.save(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<User> findUserById(@PathVariable long id) {
        return new ResponseEntity<>(userService.findUserById(id), HttpStatus.OK);
    }

    @GetMapping("/fullname/{id}")
    public ResponseEntity<String> findFullNameById(@PathVariable long id) {
        return new ResponseEntity<>(userService.searchFullNameById(id).getFullName(), HttpStatus.OK);
    }

    @GetMapping("/findRoleByUsername/{username}")
    public ResponseEntity<String> findRoleByUsername(@PathVariable String username) {
        return new ResponseEntity<>(userService.findRoleByUsername(username), HttpStatus.OK);
    }
    @GetMapping("sortby")
    public ResponseEntity<List<UserDTO>> findAllSortBy(@RequestParam String sortBy, @RequestParam String order, @RequestParam String filter) {
        return new ResponseEntity<>(userService.findAllSort(sortBy,order,filter), HttpStatus.OK);
    }
    @GetMapping("searchbyid/{id}")
    public ResponseEntity<UserDTO> findByIDdto(@PathVariable long id) {
        return new ResponseEntity<>(userService.findUserDTOById(id), HttpStatus.OK);
    }
    @GetMapping("searchbyusername")
    public ResponseEntity<UserDTO> findByUsernamedto(@RequestParam String username) {
        return new ResponseEntity<>(userService.findUserDTOByUsername(username), HttpStatus.OK);
    }


}

