package com.mycompany.myapp.domain;

import javax.persistence.*;
import org.apache.commons.math3.analysis.function.Identity;

@Entity
@Table(name = "Scan_profileCheck")
public class ScanPprofileCheck {

    @Id
    @Column(name = "profileId")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @Column(name = "productId")
    private Long productId;

    @Column(name = "checkName")
    private String checkName;

    @Column(name = "checkValue")
    private String checkValue;

    @Column(name = "checkStatus")
    private String checkStatus;

    @Column(name = "position")
    private Integer position;

    @Column(name = "versionId")
    private Long versionId;

    @Column(name = "groupId")
    private Integer groupId;

    @Column(name = "machineId")
    private Integer machineId;

    public ScanPprofileCheck() {}

    public ScanPprofileCheck(
        Long profileId,
        Long productId,
        String checkName,
        String checkValue,
        String checkStatus,
        Integer position,
        Long versionId,
        Integer groupId
    ) {
        this.profileId = profileId;
        this.productId = productId;
        this.checkName = checkName;
        this.checkValue = checkValue;
        this.checkStatus = checkStatus;
        this.position = position;
        this.versionId = versionId;
        this.groupId = groupId;
    }

    public Integer getMachineId() {
        return machineId;
    }

    public void setMachineId(Integer machineId) {
        this.machineId = machineId;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getCheckName() {
        return checkName;
    }

    public void setCheckName(String checkName) {
        this.checkName = checkName;
    }

    public String getCheckValue() {
        return checkValue;
    }

    public void setCheckValue(String checkValue) {
        this.checkValue = checkValue;
    }

    public String getCheckStatus() {
        return checkStatus;
    }

    public void setCheckStatus(String checkStatus) {
        this.checkStatus = checkStatus;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public Long getVersionId() {
        return versionId;
    }

    public void setVersionId(Long versionId) {
        this.versionId = versionId;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }
}
