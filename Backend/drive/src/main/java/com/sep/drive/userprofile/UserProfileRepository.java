package com.sep.drive.userprofile;


import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserProfileRepository extends JpaRepository<User, Long> {
    User findByid(long Id);
    User findByUsername(String username);

    public default boolean userExists(String username) {
        return findByUsername(username) != null;
    }

    @Query(value = "select * from users where id = :iD", nativeQuery = true)
    public User findUserById(@Param("iD") long id);

    @Query(value = "select firstname, lastname from users where id = :iD", nativeQuery = true)
    public MergeName findFullNameById(@Param("iD") long iD);

    @Query(value = "select role from users where username = userName", nativeQuery = true)
    public String findRoleByUsername(@Param("userName") String username);

    @Query(value = "select username, firstname, lastname, total_Distance, rating, drive_Time, total_Rides, total_Earned, full_Name from users where username = :username and role= 'DRIVER' ", nativeQuery = true)
    public List<UserDTO> findAllSortWithFilter(Sort sort, @Param("username") String username);

    @Query(value = "select username, firstname, lastname, total_Distance, rating, drive_Time, total_Rides, total_Earned, full_Name from users where role= 'DRIVER' ", nativeQuery = true)
    public List<UserDTO> findAllSort(Sort sort);

    @Query(value = "select username, firstname, lastname, total_Distance, rating, drive_Time, total_Rides, total_Earned, full_Name from users where id = :iD", nativeQuery = true)
    public UserDTO findbyIDdto(@Param("iD") long iD);

    @Query(value = "select username, firstname, lastname, total_Distance, rating, drive_Time, total_Rides, total_Earned, full_Name from users where username = username", nativeQuery = true)
    public UserDTO findbyUsernamedto(@Param("username") String username);

}

