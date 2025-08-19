package com.idat.pe.PROYECTOS.backup;


import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "backup")
public class BackupProperties {
    private boolean enabled;
    private String cron;
    private String timezone = "America/Lima";
    private String dir = "C:/backups-app";
    private int retentionDays = 0;
    private String mysqldumpPath;

}
