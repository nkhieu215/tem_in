package com.mycompany.myapp.domain;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "Scan_workOrder")
public class scanWorkorder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orderId")
    private Long orderId;

    @Column(name = "workOrder")
    private String workOrder;

    @Column(name = "lot")
    private String lot;

    @Column(name = "numberOfPlan")
    private String numberOfPlan;

    @Column(name = "productId")
    private Long productId;

    @Column(name = "groupId")
    private Integer groupId;

    @Column(name = "working")
    private Integer working;

    @Column(name = "createAt")
    private Date createAt;

    public scanWorkorder() {}

    public scanWorkorder(
        Long orderId,
        String workOrder,
        String lot,
        String numberOfPlan,
        Long productId,
        Integer groupId,
        Integer working,
        Date createAt
    ) {
        this.orderId = orderId;
        this.workOrder = workOrder;
        this.lot = lot;
        this.numberOfPlan = numberOfPlan;
        this.productId = productId;
        this.groupId = groupId;
        this.working = working;
        this.createAt = createAt;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getWorkOrder() {
        return workOrder;
    }

    public void setWorkOrder(String workOrder) {
        this.workOrder = workOrder;
    }

    public String getLot() {
        return lot;
    }

    public void setLot(String lot) {
        this.lot = lot;
    }

    public String getNumberOfPlan() {
        return numberOfPlan;
    }

    public void setNumberOfPlan(String numberOfPlan) {
        this.numberOfPlan = numberOfPlan;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public Integer getWorking() {
        return working;
    }

    public void setWorking(Integer working) {
        this.working = working;
    }

    public Date getCreateAt() {
        return createAt;
    }

    public void setCreateAt(Date createAt) {
        this.createAt = createAt;
    }
}
