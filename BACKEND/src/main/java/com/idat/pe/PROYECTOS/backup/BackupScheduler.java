package com.idat.pe.PROYECTOS.backup;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BackupScheduler {

    private final BackupProperties props;
    private final BackupService backupService;

    @Scheduled(cron = "${backup.cron}", zone = "${backup.timezone:UTC}")
    public void scheduledBackup() {
        if (!props.isEnabled()) return;
        var r = backupService.runBackupNow();
        if (!r.ok()) log.error("[BACKUP ERROR] {}", r.error());
    }
}
