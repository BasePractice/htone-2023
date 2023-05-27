package ru.research.keycloak.organizations.jpa.entity;

import lombok.Data;
import org.keycloak.models.jpa.entities.UserEntity;

import java.sql.Timestamp;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "research_organization_roles")
public class OrganizationRolesEntity {
    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;
    @Basic
    @Column(name = "name", nullable = false, length = 128)
    private String name;
    @Basic
    @Column(name = "description", nullable = false, length = 1024)
    private String description;
    @Basic
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;
    @Basic
    @Column(name = "creator", nullable = false, length = 36)
    private String creator;
    @OneToOne
    @JoinColumn(name = "creator", referencedColumnName = "id")
    private UserEntity creatorUser;
}
