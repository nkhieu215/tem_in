package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.service.InventoryService;
import com.mycompany.panacimmc.domain.Inventory;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventories")
@Transactional
public class InventoryController {

    @Autowired
    InventoryService inventoryService;

    @GetMapping("/all")
    public List<Inventory> getAllInventories() {
        return inventoryService.getAll();
    }
}
