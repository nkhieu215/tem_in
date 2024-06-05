package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.*;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface scanDetailCheckRepository extends JpaRepository<scanDetailCheck, Long> {
    @Query(value = " select * from `Scan_machines` where groupId =?1", nativeQuery = true)
    public List<scanMachines> listMachines(Long groupId);

    @Query(value = "insert into `Scan_machines` (machineName,groupId) values(?1,?2) ", nativeQuery = true)
    public void postListMachines(String machineName, Integer groupId);

    @Query(value = " update `Scan_machines` set machineName=?1, groupId =?2 where machineId = ?3 ;", nativeQuery = true)
    public void putListMachines(String machineName, Integer groupId, Integer machineId);

    @Query(value = " select * from `Scan_groupMachines` ;", nativeQuery = true)
    public List<scanGroupMachines> groupMachinesList();

    @Query(value = "insert into `Scan_groupMachines` (groupName,createAt,username,groupStatus) values(?1,?2,?3,?4) ", nativeQuery = true)
    public void insertGroupMachines(String groupName, ZonedDateTime createAt, String username, Integer groupStatus);

    @Query(
        value = "update `Scan_groupMachines` set groupName =?1 , updateAt=?2,username =?3, groupStatus =?4 where groupId =?5",
        nativeQuery = true
    )
    public void putGroupMachines(String groupName, ZonedDateTime updateAt, String username, Integer groupStatus, Integer groupId);

    @Query(value = "select * from `Scan_products` order by productStatus ;", nativeQuery = true)
    public List<scanProduct> listProduct();

    @Query(value = "select * from `Scan_machines` ", nativeQuery = true)
    public List<scanMachines> listAllMachines();

    @Query(value = "select * from `Scan_profileCheck` where productId =?1 ", nativeQuery = true)
    public List<ScanPprofileCheck> listProfileCheckByProduct(Long productId);

    @Query(
        value = "insert into `Scan_profileCheck` (productId,checkName,checkValue,checkStatus,position,versionId,machineId,groupId) values(?1,?2,?3,?4,?5,?6,?7,?8) ;",
        nativeQuery = true
    )
    public void insertScanProfileCheck(
        Long productId,
        String checkName,
        String checkValue,
        String checkStatus,
        Integer position,
        Long versionId,
        Integer machineId,
        Integer groupId
    );

    @Query(
        value = "update `Scan_profileCheck` set productId =?1, checkName=?2 , checkValue=?3, checkStatus=?4," +
        "position=?5, versionId=?6,machineId=?7,groupId=?8 where profileId=?9;",
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
        Integer groupId,
        Long profileId
    );
}
