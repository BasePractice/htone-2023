package ru.research.keycloak.organizations.jpa;

import org.keycloak.connections.jpa.entityprovider.JpaEntityProvider;
import ru.research.keycloak.organizations.jpa.entity.OrganizationEntity;

import java.util.Collections;
import java.util.List;

public class OrganizationsJpaProvider implements JpaEntityProvider {
  @Override
  public List<Class<?>> getEntities() {
    return Collections.singletonList(OrganizationEntity.class);
  }

  @Override
  public String getChangelogLocation() {
    return "META-INF/organizations-changelog.xml";
  }

  @Override
  public String getFactoryId() {
    return OrganizationsJpaProviderFactory.ID;
  }

  @Override
  public void close() {

  }
}
