package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.ScanPprofileCheck;
import com.mycompany.myapp.domain.TongHopResponse;
import com.mycompany.myapp.domain.scanGroupMachines;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface scanprofileCheckRepository extends JpaRepository<ScanPprofileCheck, Long> {
    @Query(value = "select * from Scan_profileCheck where product_id =?1 ", nativeQuery = true)
    public List<ScanPprofileCheck> listProfileCheckByProduct(Long productId);

    @Query(
        value = "select \n" +
        "  mc.machine_name as machineName,\n" +
        "  pc.position as position,\n" +
        "  pc.check_name as recordName,\n" +
        "  pc.check_value as recordValue\n" +
        "  from Scan_profileCheck as pc  \n" +
        "  inner join Scan_machines as mc on pc.machine_id = mc.machine_id\n" +
        "  where product_id = ?1 ",
        nativeQuery = true
    )
    public List<TongHopResponse> listProfileCheck(Long productId);

    @Modifying
    @Query(
        value = "insert into Scan_profileCheck (product_id,check_name,check_value,check_status,position,version_id,machine_id) values(?1,?2,?3,?4,?5,?6,?7) ;",
        nativeQuery = true
    )
    public void insertScanProfileCheck(
        Long productId,
        String checkName,
        String checkValue,
        String checkStatus,
        Integer position,
        Long versionId,
        Integer machineId
    );

    @Modifying
    @Query(
        value = "update Scan_profileCheck set product_id =?1, check_name=?2 , check_value=?3, check_status=?4," +
        "position=?5, version_id=?6,machine_id=?7 where profile_id=?9;",
        nativeQuery = true
    )
    public void updateScanProfileCheck(
        Long productId,
        String checkName,
        String checkValue,
        String checkStatus,
        Integer position,
        Long versionId,
        Integer machineId,
        Long profileId
    );
}
