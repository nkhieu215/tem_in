package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.scanProductVersions;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface scanProductVersionRepository extends JpaRepository<scanProductVersions, Long> {
    public List<scanProductVersions> findAllByProductId(Long productId);
}
