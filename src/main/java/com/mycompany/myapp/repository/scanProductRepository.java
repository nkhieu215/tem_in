package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.scanProduct;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface scanProductRepository extends JpaRepository<scanProduct, Long> {
    @Query(value = "select * from Scan_products order by product_status ;", nativeQuery = true)
    public List<scanProduct> listProduct();
}
