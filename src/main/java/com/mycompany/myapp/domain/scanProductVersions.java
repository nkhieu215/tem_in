package com.mycompany.myapp.domain;

import java.time.ZonedDateTime;
import javax.persistence.*;

@Entity
@Table(name = "Scan_productVersions")
public class scanProductVersions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "version_id")
    private Long versionId;

    @Column(name = "version")
    private String version;

    @Column(name = "product_id")
    private Long prodcucId;

    @Column(name = "create_at")
    private ZonedDateTime create;

    @Column(name = "update_at")
    private ZonedDateTime updateAt;

    public scanProductVersions() {}

    public Long getVersionId() {
        return versionId;
    }

    public void setVersionId(Long versionId) {
        this.versionId = versionId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public Long getProdcucId() {
        return prodcucId;
    }

    public void setProdcucId(Long prodcucId) {
        this.prodcucId = prodcucId;
    }

    public ZonedDateTime getCreate() {
        return create;
    }

    public void setCreate(ZonedDateTime create) {
        this.create = create;
    }

    public ZonedDateTime getUpdateAt() {
        return updateAt;
    }

    public void setUpdateAt(ZonedDateTime updateAt) {
        this.updateAt = updateAt;
    }
}
