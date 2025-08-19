package com.idat.pe.PROYECTOS.backup;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "db")
public class DbProperties {
    private String host;
    private int port = 3306;
    private String name;
    private String user;
    private String pass;
}
