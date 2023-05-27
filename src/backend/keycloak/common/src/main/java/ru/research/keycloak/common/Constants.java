package ru.research.keycloak.common;


public final class Constants {
    public static final String ENDPOINT_ACCESS_ROLE = new Environment(
            "ENDPOINT_ACCESS_ROLE", "org_access").toString();
    public static final String ENDPOINT_ORGANIZATION_MANAGER_ROLE = new Environment(
            "ENDPOINT_ORGANIZATION_MANAGER_ROLE", "org_access").toString();

    public static final String ORGANIZATIONS_KEY = "organizations";
    public static final String ORGANIZATIONS_CLAIM_KEY = ORGANIZATIONS_KEY;


    private Constants() {
    }

    public static void print() {
        Environment.print();
    }
}
