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
@Table(name = "research_organization_user_roles")
public class OrganizationUserRolesEntity {
    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;
    @Basic
    @Column(name = "organization_users_id", nullable = false, length = 36)
    private String organizationUsersId;
    @Basic
    @Column(name = "organization_roles_id", nullable = false, length = 36)
    private String organizationRolesId;
    @Basic
    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;
    @Basic
    @Column(name = "creator", nullable = false, length = 36)
    private String creator;
    @OneToOne
    @JoinColumn(name = "creator", referencedColumnName = "id")
    private UserEntity creatorUser;
    @OneToOne
    @JoinColumn(name = "organization_roles_id", referencedColumnName = "id")
    private OrganizationRolesEntity organizationRole;
}
