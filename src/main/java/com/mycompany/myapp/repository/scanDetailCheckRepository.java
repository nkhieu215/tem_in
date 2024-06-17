package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.*;
import java.time.ZonedDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestBody;

@Repository
public interface scanDetailCheckRepository extends JpaRepository<scanDetailCheck, Long> {
    public List<scanDetailCheck> findAllByOrderId(Long orderId);

    @Modifying
    @Query(
        value = " select" +
        " wo.record_name as recordName," +
        " wo.record_value as recordValue," +
        " wo.result as result, " +
        " wo.position as position, " +
        " mc.machine_name as machineName " +
        " from scan_detail_check as wo\n" +
        " inner join Scan_machines as mc on wo.machine_id = mc.machine_id\n" +
        " where wo.order_id = ?1 ;",
        nativeQuery = true
    )
    public List<TongHopResponse> listDetailCheckByWorkOrder(Long orderId);

    @Modifying
    @Query(
        value = "insert into scan_detail_check (order_id,record_value,result,position,username,machine_id,record_name,create_at) values(?1,?2,?3,?4,?5,?6,?7,?8) ;",
        nativeQuery = true
    )
    public void insertDetailCheck(
        Long orderId,
        String recordValue,
        String result,
        Integer position,
        String username,
        Long machineId,
        String recordName,
        String createAt
    );

    @Query(
        value = "SELECT \n" +
        "\t\tresult as result\n" +
        "\t  ,count(record_value) as recordValue\n" +
        "  FROM [ProfileProductions].[dbo].[scan_detail_check] where order_id = ?1 group by result ",
        nativeQuery = true
    )
    public List<TongHopResponse> tongHop(Long orderId);
}
