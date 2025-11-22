package com.sep.drive.CarRequest;

import com.sep.drive.Coords.CoordsRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarRequestService {

    private final CarRequestRepository carRequestRepository;

    public CarRequestService(CarRequestRepository carRequestRepository) {
        this.carRequestRepository = carRequestRepository;
    }

    //Zugriff auf Methoden aus CarRequestRepository für CarRequestController

    public List<CarRequest> findAll() {
        return carRequestRepository.findAll();
    }

    public CarRequest findByRId(long id) {
        return carRequestRepository.findByRId(id);
    }

    public void save(CarRequest carRequest) {
        carRequest.setStartLatitude(carRequest.getWaypoints().getFirst().getLatitude());
        carRequest.setStartLongitude(carRequest.getWaypoints().getFirst().getLongitude());
        carRequest.setDestinationLatitude(carRequest.getWaypoints().getLast().getLatitude());
        carRequest.setDestinationLongitude(carRequest.getWaypoints().getLast().getLongitude());
        carRequestRepository.save(carRequest);
    }

    public void delete(CarRequest carRequest) {
        carRequestRepository.delete(carRequest);
    }

    public CarRequest findByCId(long iD) {
        return carRequestRepository.findByCId(iD);
    }

    public CarRequest findByDId(long iD) {
        return carRequestRepository.findByDId(iD);
    }

    public List<CarRequestAvailable> findAllAvailable(String sortBy, String order) {
        Sort sort = Sort.unsorted();                                                                //setzt die Sortierart auf unsortiert
        if(sortBy != null && !sortBy.isEmpty() && order != null && !order.isEmpty()) {              //falls gegeben wird gewünschte Sortierart angewendet
            Sort.Direction direction = Sort.Direction.fromString(order.toUpperCase());
            sort = Sort.by(direction, sortBy);
        }
        return carRequestRepository.findAllAvailableSort(sort);
    }
}
