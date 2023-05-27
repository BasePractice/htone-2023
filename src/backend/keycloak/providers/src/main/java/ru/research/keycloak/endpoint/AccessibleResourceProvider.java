package ru.research.keycloak.endpoint;

import org.keycloak.models.KeycloakSession;
import org.keycloak.models.UserModel;
import org.keycloak.services.managers.AppAuthManager;
import org.keycloak.services.resource.RealmResourceProvider;

import java.util.Optional;
import javax.ws.rs.NotAuthorizedException;

import static ru.research.keycloak.common.Constants.ENDPOINT_ORGANIZATION_MANAGER_ROLE;

public abstract class AccessibleResourceProvider implements RealmResourceProvider {
    protected Optional<UserModel> accessRights(KeycloakSession session, Rights rights) {
        String token = AppAuthManager.extractAuthorizationHeaderTokenOrReturnNull(session.getContext().getRequestHeaders());
        if (token == null) {
            throw new NotAuthorizedException("Bearer");
        }
        return EndpointAccess.accessRights(session, token, rights.role);
    }

    protected enum Rights {
        ORGANIZATION_MANAGER(ENDPOINT_ORGANIZATION_MANAGER_ROLE);

        private final String role;

        Rights(String role) {
            this.role = role;
        }
    }
}
