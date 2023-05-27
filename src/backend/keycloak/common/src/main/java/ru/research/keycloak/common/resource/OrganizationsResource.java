package ru.research.keycloak.common.resource;

import lombok.Data;
import org.jboss.resteasy.annotations.cache.NoCache;
import ru.research.keycloak.common.model.UnUID;

import java.io.InputStream;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import javax.validation.constraints.NotNull;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/")
@Consumes(MediaType.APPLICATION_JSON)
public interface OrganizationsResource {
    String PROVIDER_ID = "research.resource.organizations";

    static OrganizationRepresentation newVersion() {
        OrganizationRepresentation representation = new OrganizationRepresentation();
        try (InputStream stream = OrganizationsResource.class.getResourceAsStream("/version.properties")) {
            Properties p = new Properties();
            p.load(stream);
            representation.setCreatedAt(new Date());
            representation.setCreator("unknown");
            representation.setProjectVersion(p.getProperty("project_version"));
            representation.setProjectCommit(p.getProperty("build_commit"));
            representation.setProjectBranch(p.getProperty("build_branch"));
            representation.setProjectTimestamp(p.getProperty("build_timestamp"));
        } catch (Exception ex) {
            //Empty
        }
        return representation;
    }

    @GET
    @Path("/organizations")
    @Produces(MediaType.APPLICATION_JSON)
    List<OrganizationRepresentation> list();

    @GET
    @Path("/organizations/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    OrganizationRepresentation getByID(@NotNull @UnUID @PathParam("id") String id);

    @POST
    @Path("/organizations")
    @NoCache
    @Consumes(MediaType.APPLICATION_JSON)
    Response create(@NotNull OrganizationRepresentation version);

    @Data
    final class OrganizationRepresentation {
        private String name;
        private String hash;
        private Date createdAt;
        private String creator;

        private String projectBranch;
        private String projectCommit;
        private String projectVersion;
        private String projectTimestamp;
    }
}
