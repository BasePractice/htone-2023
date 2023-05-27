package ru.research.keycloak.organizations.jpa.entity;

import lombok.Data;
import org.keycloak.models.jpa.entities.UserEntity;

import java.sql.Timestamp;
import java.util.List;
import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "research_organization_users")
public class OrganizationUsersEntity {
    @Id
    @Column(name = "id", nullable = false, length = 36)
    private String id;
    @Basic
    @Column(name = "organization_id", nullable = false, length = 36)
    private String organizationId;
    @Basic
    @Column(name = "user_id", nullable = false, length = 36)
    private String userId;
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
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    private OrganizationEntity organizationEntity;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity userEntity;
    @OneToMany
    @JoinColumn(name = "organization_users_id", referencedColumnName = "id")
    private List<OrganizationUserRolesEntity> roles;
}
