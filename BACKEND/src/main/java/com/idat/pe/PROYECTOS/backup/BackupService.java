package com.idat.pe.PROYECTOS.backup;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BackupService {

    private final BackupProperties props;
    private final DbProperties db;

    public record BackupResult(boolean ok, Path file, int exitCode, String error, long millis) {}

    public BackupResult runBackupNow() {
        long start = System.currentTimeMillis();
        try {
            // 1) Crear carpeta de salida
            Path dir = Paths.get(props.getDir());
            Files.createDirectories(dir);

            // 2) Validar/Resolver ruta a mysqldump
            String mysqldump = resolveMysqldumpPath();
            log.info("[BACKUP] mysqldumpPath='{}'", mysqldump);

            // 3) Archivo destino
            String ts = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            Path dumpFile = dir.resolve("backup_" + db.getName() + "_" + ts + ".sql");

            // 4) Construir comando (cada arg separado; sin comillas manuales)
            List<String> cmd = new ArrayList<>();
            cmd.add(mysqldump);                       // ejecutable
            cmd.add("-h"); cmd.add(db.getHost());
            cmd.add("-P"); cmd.add(String.valueOf(db.getPort()));
            cmd.add("-u"); cmd.add(db.getUser());


            cmd.add("--routines");
            cmd.add("--events");
            cmd.add("--single-transaction");
            cmd.add("--databases"); cmd.add(db.getName());

            ProcessBuilder pb = new ProcessBuilder(cmd);
            pb.redirectOutput(dumpFile.toFile());
            pb.redirectErrorStream(true);
            pb.environment().put("MYSQL_PWD", db.getPass()); // <- contraseña por env

            // 5) Ejecutar
            Process p = pb.start();

            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(p.getInputStream(), StandardCharsets.UTF_8))) {
                String line;
                while ((line = br.readLine()) != null) log.debug("[mysqldump] {}", line);
            }

            int code = p.waitFor();
            long millis = System.currentTimeMillis() - start;

            // 6) Validar salida
            long size = Files.exists(dumpFile) ? Files.size(dumpFile) : 0L;
            if (code != 0 || size == 0) {
                String err = "mysqldump exit=" + code + " size=" + size;
                log.error("[BACKUP ERROR] {}", err);
                return new BackupResult(false, dumpFile, code, err, millis);
            }

            // 7) Limpieza por retención
            cleanupOldBackups(dir, props.getRetentionDays());
            log.info("[BACKUP OK] {} ({} ms)", dumpFile, millis);
            return new BackupResult(true, dumpFile, code, null, millis);

        } catch (Exception ex) {
            log.error("[BACKUP EXCEPTION] {}", ex.getMessage(), ex);
            return new BackupResult(false, null, -1, ex.getMessage(),
                    System.currentTimeMillis() - start);
        }
    }

    private String resolveMysqldumpPath() {
        String path = props.getMysqldumpPath();
        if (path == null || path.isBlank()) {
            return "mysqldump"; // dependerá del PATH del SO
        }
        // Quitar comillas por si lo pusieron copiado del explorador
        path = path.replace("\"", "").trim();

        // Si existe tal cual, usarlo
        Path p = Paths.get(path);
        if (Files.exists(p)) return p.toString();

        // Si no termina en .exe, probar agregándolo (Windows)
        if (!path.toLowerCase().endsWith(".exe")) {
            Path p2 = Paths.get(path + ".exe");
            if (Files.exists(p2)) return p2.toString();
        }

        // Último recurso: devolver el texto y que el SO lo busque en PATH
        return path;
    }

    private void cleanupOldBackups(Path dir, int retentionDays) throws IOException {
        if (retentionDays <= 0) return;
        try (DirectoryStream<Path> s = Files.newDirectoryStream(dir, "backup_*.sql")) {
            Instant limit = Instant.now().minus(Duration.ofDays(retentionDays));
            for (Path p : s) {
                if (Instant.ofEpochMilli(p.toFile().lastModified()).isBefore(limit)) {
                    Files.deleteIfExists(p);
                    log.info("[BACKUP CLEANUP] {}", p.getFileName());
                }
            }
        }
    }
}
