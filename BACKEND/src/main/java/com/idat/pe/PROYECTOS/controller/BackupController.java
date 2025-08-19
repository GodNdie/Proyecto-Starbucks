package com.idat.pe.PROYECTOS.controller;


import com.idat.pe.PROYECTOS.backup.BackupProperties;
import com.idat.pe.PROYECTOS.backup.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/admin/backups")
@RequiredArgsConstructor
public class BackupController {

    private final BackupService backupService;
    private final BackupProperties props;

    @PostMapping("/run")
    public ResponseEntity<?> run() {
        var r = backupService.runBackupNow();
        Map<String, Object> body = new HashMap<>();
        body.put("ok", r.ok());
        body.put("file", r.file() != null ? r.file().toString() : null);
        body.put("millis", r.millis());
        body.put("exitCode", r.exitCode());
        body.put("error", r.error());
        return r.ok() ? ResponseEntity.ok(body) : ResponseEntity.status(500).body(body);
    }

    @GetMapping("/list")
    public List<Map<String, Object>> list() throws IOException {
        Path dir = Paths.get(props.getDir());
        if (!Files.exists(dir)) return List.of();

        try (var s = Files.list(dir)) {
            return s.filter(p -> p.getFileName().toString().endsWith(".sql"))
                    .sorted(Comparator.comparingLong((Path p) -> p.toFile().lastModified()).reversed())
                    .map(p -> {
                        Map<String, Object> m = new LinkedHashMap<>();
                        m.put("file", p.getFileName().toString());
                        m.put("sizeBytes", p.toFile().length());
                        // puedes devolver Date, Instant o String ISO. Aquí ISO:
                        m.put("modified", Instant.ofEpochMilli(p.toFile().lastModified()).toString());
                        return m;
                    })
                    .collect(java.util.stream.Collectors.toList());
        }
    }
}
