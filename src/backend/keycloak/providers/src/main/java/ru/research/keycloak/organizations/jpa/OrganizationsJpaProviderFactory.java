package ru.research.keycloak.organizations.jpa;

import org.keycloak.Config;
import org.keycloak.connections.jpa.entityprovider.JpaEntityProvider;
import org.keycloak.connections.jpa.entityprovider.JpaEntityProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

public class OrganizationsJpaProviderFactory implements JpaEntityProviderFactory {
    public static final String ID = "research.jpa.organizations";

    @Override
    public JpaEntityProvider create(KeycloakSession session) {
        return new OrganizationsJpaProvider();
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
        return ID;
    }
}
