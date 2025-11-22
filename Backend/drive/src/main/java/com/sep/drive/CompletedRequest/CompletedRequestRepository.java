package com.sep.drive.CompletedRequest;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CompletedRequestRepository extends JpaRepository<CompletedRequest, Long> {

    //sucht completed_requests nach requestId
    @Query(value = "select * from completed_requests where request_id = :iD", nativeQuery = true)
    public CompletedRequest findByRId (@Param("iD") long iD);

    //sucht completed_requests nach customerId
    @Query(value = "select * from completed_requests where customer_id = :iD", nativeQuery = true)
    public List<CompletedRequest> findByCId(@Param("iD") long iD);

    //sucht completed_requests nach driverId
    @Query(value = "select * from completed_requests where driver_id = :iD", nativeQuery = true)
    public List<CompletedRequest> findByDId(@Param("iD") long iD);

    //sortiert alle Zeilen und gibt sie aus
    @Query(value = "select * from completed_requests", nativeQuery = true)
    public List<CompletedRequest> findAllSort(Sort sort);
}
