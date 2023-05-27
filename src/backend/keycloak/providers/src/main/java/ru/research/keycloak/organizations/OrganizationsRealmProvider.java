package ru.research.keycloak.organizations;

import org.jboss.logging.Logger;
import org.keycloak.connections.jpa.JpaConnectionProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.UserModel;
import org.keycloak.services.managers.AppAuthManager;
import org.keycloak.services.resource.RealmResourceProvider;
import ru.research.keycloak.common.resource.OrganizationsResource;
import ru.research.keycloak.endpoint.EndpointAccess;
import ru.research.keycloak.organizations.jpa.entity.OrganizationEntity;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.transaction.Transactional;
import javax.ws.rs.core.Response;

public final class OrganizationsRealmProvider implements RealmResourceProvider {
    private static final Logger LOGGER = Logger.getLogger(OrganizationsRealmProvider.class);
    private final KeycloakSession session;

    public OrganizationsRealmProvider(KeycloakSession session) {
        this.session = session;
    }

    @Override
    public Object getResource() {
        final String tokenString = AppAuthManager.extractAuthorizationHeaderTokenOrReturnNull(session.getContext().getRequestHeaders());
        if (tokenString == null)
            return Response.status(Response.Status.UNAUTHORIZED).build();
        Optional<UserModel> user = EndpointAccess.accessRights(session, tokenString);
        return new OrganizationsResource() {
            @Override
            public List<OrganizationRepresentation> list() {
                return getEntityManager()
                        .createNamedQuery("findAll", OrganizationEntity.class)
                        .getResultStream()
                        .map(this::toRepresentation).collect(Collectors.toList());
            }

            @Override
            public OrganizationRepresentation getByID(String id) {
                try {
                    return toRepresentation(getEntityManager()
                            .createNamedQuery("findById", OrganizationEntity.class)
                            .setParameter("id", id)
                            .getSingleResult());
                } catch (NoResultException | NonUniqueResultException ex) {
                    return null;
                }
            }

            private OrganizationRepresentation toRepresentation(OrganizationEntity entity) {
                OrganizationRepresentation representation = new OrganizationRepresentation();
                representation.setName(entity.getName());
                representation.setCreator(entity.getCreator());
                representation.setCreatedAt(entity.getCreatedAt());
                return representation;
            }

            @Transactional
            @Override
            public Response create(OrganizationRepresentation representation) {
                try {
                    OrganizationEntity entity = new OrganizationEntity();
                    user.ifPresent(user -> {
                        entity.setCreator(user.getId());
                    });
                    entity.setId(UUID.randomUUID().toString());
                    entity.setName(representation.getName());
                    entity.setCreatedAt(representation.getCreatedAt());
                    getEntityManager().persist(entity);
                    return Response.created(
                                    session.getContext().getUri().getAbsolutePathBuilder().path(String.valueOf(entity.getId())).build())
                            .build();
                } catch (Exception e) {
                    LOGGER.error("", e);
                    return Response.status(Response.Status.BAD_REQUEST).build();
                }
            }
        };
    }

    private EntityManager getEntityManager() {
        return session.getProvider(JpaConnectionProvider.class).getEntityManager();
    }

    @Override
    public void close() {

    }
}
