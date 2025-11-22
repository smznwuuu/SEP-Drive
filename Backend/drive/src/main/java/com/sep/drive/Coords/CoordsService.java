package com.sep.drive.Coords;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoordsService {

    private final CoordsRepository coordsRepository;

    public CoordsService(CoordsRepository coordsRepository) {
        this.coordsRepository = coordsRepository;
    }

    public List<Coords> findAll() {
        return coordsRepository.findAll();
    }

    public void save(Coords coords) {
        coordsRepository.save(coords);
    }

    public void delete(Coords coords) {
        coordsRepository.delete(coords);
    }

    public Coords findPosition(long id, int order) {
        return coordsRepository.findPosition(id, order);
    }

    public List<Coords> findAllByRId(long id) {
        return coordsRepository.findAllByRId(id);
    }

    @Transactional
    public void deleteByRId(long id) {
        coordsRepository.deleteByRId(id);
    }
}
