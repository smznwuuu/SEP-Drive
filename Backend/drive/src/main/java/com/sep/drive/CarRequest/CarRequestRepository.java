package com.sep.drive.CarRequest;


import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;


@Repository
public interface CarRequestRepository extends JpaRepository<CarRequest, Long> {
    //sucht Requests mit der angegebenen ID der Request
    @Query(value = "select * from car_request where request_Id = :iD", nativeQuery = true)
    public CarRequest findByRId (@Param("iD") long iD);

    //sucht Requests mit der angegebenen ID des Kunden
    @Query(value = "select * from car_request where customer_Id = :iD", nativeQuery = true)
    public CarRequest findByCId(@Param("iD") long iD);

    @Query(value = "select * from car_request where driver_Id = :iD", nativeQuery = true)
    public CarRequest findByDId(@Param("iD") long iD);

    //sucht alle aktiven Requests und gibt nur bestimmte columns aus
    @Query(value = "select request_Id, time, start_Latitude, start_Longitude, customer_Name, rating, vehicle_Class, distance, duration, price, driver_Id, customer_Id from car_request where is_Active = true", nativeQuery = true)
    public List<CarRequestAvailable> findAllAvailable();

    //sucht und sortiert alle aktiven Requests und gibt nur bestimmte columns aus
    @Query(value = "select request_Id, time, start_Latitude, start_Longitude, customer_Name, rating, vehicle_Class, distance, duration, price, driver_Id, customer_Id from car_request where is_Active = true", nativeQuery = true)
    public List<CarRequestAvailable> findAllAvailableSort(Sort sort);
}
