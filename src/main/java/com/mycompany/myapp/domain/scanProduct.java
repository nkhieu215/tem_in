package com.mycompany.myapp.domain;

import java.time.ZonedDateTime;
import javax.persistence.*;

@Entity
@Table(name = "Scan_product")
public class scanProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "productId")
    private Long productId;

    @Column(name = "productCode")
    private String productCode;

    @Column(name = "productName")
    private String productName;

    @Column(name = "productVersion")
    private String productVersion;

    @Column(name = "createAt")
    private ZonedDateTime createAt;

    @Column(name = "updateAt")
    private ZonedDateTime updateAt;

    @Column(name = "username")
    private String username;

    @Column(name = "productStatus")
    private Integer productStatus;

    public scanProduct(
        Long productId,
        String productCode,
        String productName,
        String productVersion,
        ZonedDateTime createAt,
        ZonedDateTime updateAt,
        String username,
        Integer productStatus
    ) {
        this.productId = productId;
        this.productCode = productCode;
        this.productName = productName;
        this.productVersion = productVersion;
        this.createAt = createAt;
        this.updateAt = updateAt;
        this.username = username;
        this.productStatus = productStatus;
    }

    public scanProduct() {}

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductCode() {
        return productCode;
    }

    public void setProductCode(String productCode) {
        this.productCode = productCode;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductVersion() {
        return productVersion;
    }

    public void setProductVersion(String productVersion) {
        this.productVersion = productVersion;
    }

    public ZonedDateTime getCreateAt() {
        return createAt;
    }

    public void setCreateAt(ZonedDateTime createAt) {
        this.createAt = createAt;
    }

    public ZonedDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(ZonedDateTime updateAt) {
        this.updateAt = updateAt;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getProductStatus() {
        return productStatus;
    }

    public void setProductStatus(Integer productStatus) {
        this.productStatus = productStatus;
    }
}
