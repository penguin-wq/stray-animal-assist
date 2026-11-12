# Backend Help

Guide for working on the StrayAssist backend. For the full stack, see the root [help.md](../help.md).

## Stack

| | |
|---|---|
| Language | Java 21 |
| Framework | Spring Boot (web, actuator) |
| Build | Gradle (wrapper included) |
| Port | `8080` |
| Base package | `com.strayassist.backend` |

## Requirements

- JDK 21, or Docker
- No Gradle install needed. Use the wrapper (`./gradlew`).

## Commands

Run from `backend/`. On Windows use `gradlew.bat` instead of `./gradlew`.

| Command | Purpose |
|---|---|
| `./gradlew bootRun` | Run the API at `http://localhost:8080` |
| `./gradlew test` | Run tests |
| `./gradlew build` | Compile, test, and package (what CI runs) |
| `./gradlew bootJar` | Build `build/libs/app.jar` |
| `./gradlew clean` | Delete the `build/` folder |

Run the packaged jar:

```bash
java -jar build/libs/app.jar
```

With Docker, from the repository root:

```bash
docker compose up --build backend
```

## Endpoints

| Method | Path | Response |
|---|---|---|
| GET | `/api/hello` | `{"message":"Hello from Spring Boot"}` |
| GET | `/actuator/health` | Health status |

```bash
curl http://localhost:8080/api/hello
```

## Project Structure

```
backend/
├── build.gradle
├── settings.gradle
├── gradlew, gradlew.bat
├── gradle/wrapper/
├── Dockerfile
└── src/
    ├── main/
    │   ├── java/com/strayassist/backend/
    │   │   ├── BackendApplication.java
    │   │   └── HelloController.java
    │   └── resources/application.properties
    └── test/
```

## Adding an Endpoint

Put every route under `/api`. The frontend proxy only forwards paths that start with `/api`.

`src/main/java/com/strayassist/backend/RescueController.java`

```java
package com.strayassist.backend;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/rescues")
public class RescueController {

    @GetMapping
    public List<String> list() {
        return List.of();
    }
}
```

Keep controllers in the base package or a subpackage so Spring finds them.

After adding code, rebuild:

```bash
docker compose up --build backend
```

## Configuration

Settings go in `src/main/resources/application.properties`.

| Property | Purpose |
|---|---|
| `server.port` | Change the port (default `8080`) |

If you change the port, update `VITE_PROXY_TARGET` and the port mapping in `docker-compose.yml`.

## Test

- Location: `src/test/java/`
- Run: `./gradlew test`
- Report: `build/reports/tests/test/index.html`

## Troubleshooting

**`permission denied: ./gradlew`**
Run `chmod +x gradlew`.

**Build fails on the wrong Java version**
Check `java -version`. The project needs 21.

**Docker build fails with a missing wrapper**
Commit `gradle/wrapper/gradle-wrapper.jar`. It must not be git-ignored.

**404 from the frontend, works on port 8080**
The route is not under `/api`, so the proxy does not forward it.

**Code changes do not show up in Docker**
The backend is not hot-reloaded. Rebuild with `docker compose up --build backend`.

**Port 8080 already in use**
Stop the other process or run `docker compose down`.

**Slow first start**
Startup takes about 15 seconds inside Docker. Wait for the `Started BackendApplication` log line.
