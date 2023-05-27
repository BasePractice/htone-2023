package ru.research.keycloak.organizations.jpa.entity;

import lombok.Data;
import org.keycloak.models.jpa.entities.UserEntity;

import java.util.Date;
import java.util.List;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "research_organizations")
@NamedQuery(name = "findByName", query = "FROM OrganizationEntity where name = :name")
@NamedQuery(name = "findById", query = "FROM OrganizationEntity where id = :id")
@NamedQuery(name = "findAll", query = "FROM OrganizationEntity ORDER BY created_at")
public class OrganizationEntity {
    @Id
    @Column(name = "id", unique = true, nullable = false, length = 36)
    private String id;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "created_at", nullable = false)
    private Date createdAt;
    @Column(name = "creator", nullable = false)
    private String creator;
    @OneToOne
    @JoinColumn(name = "creator", referencedColumnName = "id")
    private UserEntity creatorUser;
    @OneToMany
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    private List<OrganizationAttributesEntity> attributes;
    @OneToMany
    @JoinColumn(name = "organization_id", referencedColumnName = "id")
    private List<OrganizationUsersEntity> users;
}
