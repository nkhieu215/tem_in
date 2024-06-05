package com.mycompany.myapp.domain;

import java.time.ZonedDateTime;
import javax.persistence.*;

@Entity
@Table(name = "Scan_groupMachines")
public class scanGroupMachines {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "groupId")
    private Integer groupId;

    @Column(name = "groupName")
    private String groupName;

    @Column(name = "createAt")
    private ZonedDateTime createAt;

    @Column(name = "updateAt")
    private ZonedDateTime updateAt;

    @Column(name = "username")
    private String username;

    @Column(name = "groupStatus")
    private Integer groupStatus;

    public scanGroupMachines() {}

    public scanGroupMachines(
        Integer groupId,
        String groupName,
        ZonedDateTime createAt,
        ZonedDateTime updateAt,
        String username,
        Integer groupStatus
    ) {
        this.groupId = groupId;
        this.groupName = groupName;
        this.createAt = createAt;
        this.updateAt = updateAt;
        this.username = username;
        this.groupStatus = groupStatus;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
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

    public Integer getGroupStatus() {
        return groupStatus;
    }

    public void setGroupStatus(Integer groupStatus) {
        this.groupStatus = groupStatus;
    }
}
