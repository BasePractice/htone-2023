package ru.research.keycloak.identity.token;

import org.jboss.logging.Logger;
import org.keycloak.connections.jpa.JpaConnectionProvider;
import org.keycloak.models.ClientSessionContext;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.ProtocolMapperModel;
import org.keycloak.models.UserSessionModel;
import org.keycloak.protocol.oidc.mappers.AbstractOIDCProtocolMapper;
import org.keycloak.protocol.oidc.mappers.OIDCAccessTokenMapper;
import org.keycloak.protocol.oidc.mappers.OIDCAccessTokenResponseMapper;
import org.keycloak.protocol.oidc.mappers.OIDCAttributeMapperHelper;
import org.keycloak.protocol.oidc.mappers.OIDCIDTokenMapper;
import org.keycloak.protocol.oidc.mappers.UserInfoTokenMapper;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.representations.AccessToken;
import org.keycloak.representations.IDToken;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.persistence.EntityManager;

import static ru.research.keycloak.common.Constants.ORGANIZATIONS_CLAIM_KEY;
import static ru.research.keycloak.common.Constants.ORGANIZATIONS_KEY;

public final class OrganizationsAccessTokenMapper extends AbstractOIDCProtocolMapper
        implements OIDCAccessTokenMapper, OIDCIDTokenMapper, UserInfoTokenMapper, OIDCAccessTokenResponseMapper {
    private static final Logger LOGGER = Logger.getLogger(OrganizationsAccessTokenMapper.class);

    private static final List<ProviderConfigProperty> CONFIG_PROPERTIES = new ArrayList<>();

    static {
        OIDCAttributeMapperHelper.addIncludeInTokensConfig(CONFIG_PROPERTIES, OrganizationsAccessTokenMapper.class);
    }

    public List<ProviderConfigProperty> getConfigProperties() {
        return CONFIG_PROPERTIES;
    }

    @Override
    public String getId() {
        return "research.token.organizations-id";
    }

    @Override
    public String getDisplayType() {
        return "Получение информации об организации";
    }

    @Override
    public String getDisplayCategory() {
        return TOKEN_MAPPER_CATEGORY;
    }

    @Override
    public String getHelpText() {
        return "Обогащение пользовательского 'access_token' необходимой информацией об организациях для работы в инфраструктуре";
    }

    @Override
    public IDToken transformIDToken(IDToken token, ProtocolMapperModel mappingModel, KeycloakSession session,
                                    UserSessionModel userSession, ClientSessionContext context) {
        if (!OIDCAttributeMapperHelper.includeInIDToken(mappingModel)) {
            return token;
        }
        enhanceInformation(token, session, userSession, context);
        return token;
    }

    @Override
    public AccessToken transformAccessToken(AccessToken token, ProtocolMapperModel mappingModel,
                                            KeycloakSession session, UserSessionModel userSession,
                                            ClientSessionContext context) {
        if (!OIDCAttributeMapperHelper.includeInAccessToken(mappingModel)) {
            return token;
        }
        enhanceInformation(token, session, userSession, context);
        return token;
    }

    @Override
    public AccessToken transformUserInfoToken(AccessToken token, ProtocolMapperModel mappingModel,
                                              KeycloakSession session, UserSessionModel userSession,
                                              ClientSessionContext context) {
        if (!OIDCAttributeMapperHelper.includeInUserInfo(mappingModel)) {
            return token;
        }
        enhanceInformation(token, session, userSession, context);
        return token;
    }

    private static <T extends IDToken> void enhanceInformation(T token, KeycloakSession session,
                                                               UserSessionModel userSession,
                                                               ClientSessionContext context) {
        EntityManager em = em(session);
        String clientId = context.getClientSession().getClient().getClientId();
        Map<String, String> notes = userSession.getNotes();
        String organizations = notes.get(ORGANIZATIONS_KEY);
        if (organizations != null && !organizations.isEmpty()) {
            token.getOtherClaims().put(ORGANIZATIONS_CLAIM_KEY, organizations);
        }
    }

    private static EntityManager em(KeycloakSession session) {
        return session.getProvider(JpaConnectionProvider.class).getEntityManager();
    }
}
