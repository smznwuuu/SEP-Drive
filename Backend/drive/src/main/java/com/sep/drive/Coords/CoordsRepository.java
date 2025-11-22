package com.sep.drive.Coords;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CoordsRepository extends JpaRepository<Coords, Long> {

    @Query(value = "select * from coords where ord = :ord and request_id = :id", nativeQuery = true)
    public Coords findPosition(@Param("id") long id, @Param("ord") int ord);

    @Query(value = "select * from coords where request_id = :id", nativeQuery = true)
    public List<Coords> findAllByRId(@Param("id") long id);

    @Modifying
    @Query(value = "delete from coords where request_id = :id", nativeQuery = true)
    public void deleteByRId(@Param("id") long id);
}
