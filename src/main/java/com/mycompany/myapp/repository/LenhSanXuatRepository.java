package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.LenhSanXuat;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the LenhSanXuat entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LenhSanXuatRepository extends JpaRepository<LenhSanXuat, Long> {
    @Query(
        "select lenh_san_xuat from LenhSanXuat lenh_san_xuat where " +
        "lenh_san_xuat.maLenhSanXuat like %:b% and lenh_san_xuat.sapCode like %:c% " +
        "and lenh_san_xuat.sapName like %:d% and lenh_san_xuat.workOrderCode like %:e% " +
        "and lenh_san_xuat.version like %:f% and lenh_san_xuat.storageCode like %:g% " +
        "and lenh_san_xuat.createBy like %:h% and lenh_san_xuat.trangThai like %:i%"
    )
    public List<LenhSanXuat> timKiemLenhSanXuat(
        @Param("b") String maLenhSanXuat,
        @Param("c") String sapCode,
        @Param("d") String sapName,
        @Param("e") String workOrderCode,
        @Param("f") String version,
        @Param("g") String storageCode,
        @Param("h") String createBy,
        @Param("i") String trangThai
    );

    @Query(
        value = "select * from lenh_san_xuat LenhSanXuat where" +
        " trang_thai = N'Chờ duyệt' or trang_thai = N'Đã phê duyệt' " +
        "or trang_thai = N'Từ chối' or trang_thai = N'Kho hủy'",
        nativeQuery = true
    )
    public List<LenhSanXuat> timKiemQuanLyPheDuyet();

    @Query(value = "select DISTINCT ma_lenh_san_xuat from lenh_san_xuat LenhSanXuat ", nativeQuery = true)
    public List<String> getListMaLenhSanXuat();

    @Query(value = "select DISTINCT sap_code from lenh_san_xuat LenhSanXuat ", nativeQuery = true)
    public List<String> getListSapCode();

    @Query(value = "select DISTINCT sap_name from lenh_san_xuat LenhSanXuat ", nativeQuery = true)
    public List<String> getListSapName();

    @Query(value = "select DISTINCT work_order_code from lenh_san_xuat LenhSanXuat ", nativeQuery = true)
    public List<String> getListWorkOrderCode();

    @Query(value = "select DISTINCT version from lenh_san_xuat LenhSanXuat ", nativeQuery = true)
    public List<String> getListVersion();
}
