package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.scanWorkorder;
import com.mycompany.myapp.domain.workOrderInfo;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface scanWorkOrderRepository extends JpaRepository<scanWorkorder, Long> {
    @Query(
        value = "select " +
        "wo.order_id as orderId," +
        "wo.work_order as workOrder,\n" +
        " wo.lot as lot,\n" +
        " wo.number_of_plan as sanLuong,\n" +
        " wo.working as trangThai,\n" +
        " pd.product_code as productCode,\n" +
        " pd.product_name as productName,\n" +
        " wo.create_at as createAt,\n" +
        " gm.group_name as groupName, " +
        "wo.group_id as groupId," +
        "wo.product_id as productId, " +
        "wo.run_time as runTime " +
        " from Scan_workOrder as wo\n" +
        "  inner join scan_products as pd on pd.product_id = wo.product_id\n" +
        "  inner join Scan_groupMachines as gm on gm.group_id = wo.group_id " +
        "order by order_id desc; ",
        nativeQuery = true
    )
    public List<workOrderInfo> listWorkOrderByGroup();

    @Query(value = "update Scan_workOrder set working=?1 " + "inner join scan " + "where order_id=?2;", nativeQuery = true)
    public void updateWorkingWorkOrder(Integer working, Long orderId);

    @Query(
        value = "select " +
        " wo.order_id as orderId," +
        " wo.work_order as workOrder,\n" +
        " wo.lot as lot,\n" +
        " wo.number_of_plan as sanLuong,\n" +
        " wo.working as trangThai,\n" +
        " pd.product_code as productCode,\n" +
        " pd.product_name as productName,\n" +
        " wo.create_at as createAt,\n" +
        " gm.group_name as groupName," +
        "wo.group_id as groupId, " +
        "wo.product_id as productId," +
        "wo.run_time as runTime," +
        "pd.product_version as version " +
        " from Scan_workOrder as wo\n" +
        "  inner join scan_products as pd on pd.product_id = wo.product_id\n" +
        "  inner join Scan_groupMachines as gm on gm.group_id = wo.group_id " +
        "where wo.order_id =?1 ; ",
        nativeQuery = true
    )
    public workOrderInfo listWorkOrderByGroupById(Long orderId);

    @Modifying
    @Query(value = "update Scan_workOrder set working = ?1, run_time = ?2 where order_id = ?3", nativeQuery = true)
    public void updateWorkOrderWorking(Integer working, Integer runTime, Long orderId);
}
