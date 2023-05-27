package ru.research.keycloak.organizations;

import org.keycloak.Config;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.services.resource.RealmResourceProvider;
import org.keycloak.services.resource.RealmResourceProviderFactory;
import ru.research.keycloak.common.resource.OrganizationsResource;

public final class OrganizationsRealmProviderFactory implements RealmResourceProviderFactory {
  @Override
  public RealmResourceProvider create(KeycloakSession session) {
    return new OrganizationsRealmProvider(session);
  }

  @Override
  public void init(Config.Scope config) {

  }

  @Override
  public void postInit(KeycloakSessionFactory factory) {

  }

  @Override
  public void close() {

  }

  @Override
  public String getId() {
    return OrganizationsResource.PROVIDER_ID;
  }
}
