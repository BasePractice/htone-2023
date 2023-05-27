package ru.research.keycloak.common;

import org.jboss.logging.Logger;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Map;

public final class Environment {
  private static final Logger LOGGER = Logger.getLogger(Environment.class);
  private static final Map<String, String> VALUES = new HashMap<>();
  private final String name;
  private final String value;

  public Environment(String name, String value) {
    this.name = name;
    this.value = value;
    VALUES.put(name, value());
  }

  public Environment(String name) {
    this(name, (String) null);
  }

  public Environment(String name, Boolean value) {
    this(name, String.valueOf(value));
  }

  public Environment(String name, Long value) {
    this(name, String.valueOf(value));
  }

  public static void print() {
    LOGGER.warn("Параметры");
    VALUES.keySet().stream().sorted().forEach(key ->
        LOGGER.warn(MessageFormat.format("{0} = {1}", key, VALUES.get(key))));
  }

  private String value() {
    String result = System.getenv(name);
    if (result == null)
      return value;
    return result;
  }

  public String toString() {
    return value();
  }

  public boolean toBoolean() {
    return Boolean.parseBoolean(value());
  }

  public long toLong() {
    return Long.parseLong(value());
  }
}
