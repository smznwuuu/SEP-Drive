package com.sep.drive.CompletedRequest;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CompletedRequestService {

    private final CompletedRequestRepository repository;

    //Methoden für Zugriff von Controller aus

    public CompletedRequestService(CompletedRequestRepository repository) {
        this.repository = repository;
    }

    public List<CompletedRequest> findAll() {
        return repository.findAll();
    }

    public void save(CompletedRequest completedCarRequest) {
        repository.save(completedCarRequest);
    }

    public void delete(CompletedRequest completedCarRequest) {
        repository.delete(completedCarRequest);
    }

    public CompletedRequest findByRId(long iD) {
        return repository.findByRId(iD);
    }

    public List<CompletedRequest> findByCId(long iD) {
        return repository.findByCId(iD);
    }

    public List<CompletedRequest> findByDId(long iD) {
        return repository.findByDId(iD);
    }

    public List<CompletedRequest> findAllSort(String sortBy, String order) {
        Sort sort = Sort.unsorted();                                                                    //bei keiner Eingabe wird nicht sortiert
        if(sortBy != null && !sortBy.isEmpty() && order != null && !order.isEmpty()) {                  //fragt ab, ob Eingaben für Sortiermethode gültig sind und setzt sie ein
            Sort.Direction direction = Sort.Direction.fromString(order.toUpperCase());
            sort = Sort.by(direction, sortBy);
        }
        return repository.findAllSort(sort);
    }
}
