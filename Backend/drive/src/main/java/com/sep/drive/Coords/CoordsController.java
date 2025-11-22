package com.sep.drive.Coords;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CoordsController {

    private final CoordsService coordsService;

    public CoordsController(CoordsService coordsService) {
        this.coordsService = coordsService;
    }
}
