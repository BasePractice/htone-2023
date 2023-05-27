package ru.research.keycloak.endpoint;

import org.keycloak.OAuthErrorException;
import org.keycloak.TokenVerifier;
import org.keycloak.common.VerificationException;
import org.keycloak.crypto.SignatureProvider;
import org.keycloak.crypto.SignatureVerifierContext;
import org.keycloak.models.*;
import org.keycloak.representations.AccessToken;
import org.keycloak.services.ErrorResponseException;
import org.keycloak.services.Urls;
import org.keycloak.services.managers.AuthenticationManager;
import org.keycloak.services.managers.UserSessionCrossDCManager;

import javax.ws.rs.core.Response;

import java.util.Optional;

import static ru.research.keycloak.common.Constants.ENDPOINT_ACCESS_ROLE;

public final class EndpointAccess {
  public static Optional<UserModel> accessRights(KeycloakSession session, String tokenString) {
    return accessRights(session, tokenString, ENDPOINT_ACCESS_ROLE);
  }

  public static Optional<UserModel> accessRights(KeycloakSession session, String tokenString, String role) {
    final KeycloakContext context = session.getContext();
    RealmModel realm = context.getRealm();
    try {
      TokenVerifier<AccessToken> verifier = TokenVerifier.create(tokenString, AccessToken.class).withDefaultChecks()
          .realmUrl(Urls.realmIssuer(context.getUri().getBaseUri(), realm.getName()));

      SignatureVerifierContext verifierContext = session.getProvider(
          SignatureProvider.class, verifier.getHeader().getAlgorithm().name()).verifier(verifier.getHeader().getKeyId());
      verifier.verifierContext(verifierContext);

      AccessToken token = verifier.verify().getToken();
      ClientModel clientModel = realm.getClientByClientId(token.getIssuedFor());
      if (clientModel == null) {
        throw new ErrorResponseException(
            OAuthErrorException.INVALID_REQUEST, "Client not found", Response.Status.BAD_REQUEST);
      }
      UserModel user = null;
      boolean isAdministrator;
      //FIXME: Рассмотреть другой вариант детектирования client_credentials аутентификации. Например aud = account, token.getAudience()
      if (token.getPreferredUsername().startsWith("service-account-")) {
        isAdministrator = token.getRealmAccess().isUserInRole(role);
      } else {
        UserSessionModel userSession = findValidSession(session, token, realm, clientModel);
        user = userSession.getUser();
        isAdministrator = user.getRealmRoleMappingsStream().anyMatch(r -> role.equalsIgnoreCase(r.getName()));
      }
      if (!isAdministrator)
        throw new ErrorResponseException(
            OAuthErrorException.ACCESS_DENIED, "Only administrator have rights", Response.Status.UNAUTHORIZED);
      return Optional.ofNullable(user);
    } catch (VerificationException e) {
      throw new ErrorResponseException("Token verification failed", e.getMessage(), Response.Status.UNAUTHORIZED);
    }
  }

  public static UserSessionModel findValidSession(KeycloakSession session, AccessToken token, RealmModel realm, ClientModel client) {
    UserSessionModel userSession = new UserSessionCrossDCManager(session).getUserSessionWithClient(
        realm, token.getSessionState(), false, client.getId());
    UserSessionModel offlineUserSession;
    if (AuthenticationManager.isSessionValid(realm, userSession)) {
      return userSession;
    } else {
      offlineUserSession = new UserSessionCrossDCManager(session).getUserSessionWithClient(
          realm, token.getSessionState(), true, client.getId());
      if (AuthenticationManager.isOfflineSessionValid(realm, offlineUserSession)) {
        return offlineUserSession;
      }
    }

    if (userSession == null && offlineUserSession == null) {
      throw new ErrorResponseException(
          OAuthErrorException.ACCESS_DENIED,
          "User session not found or doesn't have client attached on it", Response.Status.UNAUTHORIZED);
    }
    throw new ErrorResponseException(
        OAuthErrorException.INVALID_TOKEN, "Session expired", Response.Status.UNAUTHORIZED);
  }
}
