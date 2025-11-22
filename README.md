# Gruppe M - Fahrdienstvermittlungsplattform

Eine moderne Webanwendung zur Vermittlung von Fahrten zwischen Kunden und Fahrern. Die Plattform ermöglicht es Kunden, Fahranfragen zu erstellen, und Fahrern, sich auf diese zu bewerben. Mit integrierter Echtzeit-Kommunikation, Routenplanung und Bewertungssystem.

## 📋 Inhaltsverzeichnis

- [Überblick](#überblick)
- [Technische Anforderungen](#technische-anforderungen)
- [Technologie-Stack](#technologie-stack)
- [Installation](#installation)
- [Verwendung](#verwendung)
- [Projektstruktur](#projektstruktur)
- [Funktionen](#funktionen)
- [Entwicklung](#entwicklung)

## 🎯 Überblick

Gruppe M ist eine vollständige Fahrdienstvermittlungsplattform, die es Kunden ermöglicht, Fahranfragen zu erstellen und Fahrern, sich auf diese zu bewerben. Die Anwendung bietet:

- **Benutzerverwaltung**: Registrierung, Login mit Zwei-Faktor-Authentifizierung (2FA)
- **Rollenbasierte Zugriffe**: Kunden und Fahrer mit unterschiedlichen Berechtigungen
- **Fahranfragen-Management**: Erstellung, Verwaltung und Löschung von Fahranfragen
- **Echtzeit-Kommunikation**: Chat-System zwischen Kunden und Fahrern
- **Routenplanung**: Integration mit OpenStreetMap für Routenberechnung
- **Fahrtsimulation**: Echtzeit-Verfolgung von Fahrten
- **Bewertungssystem**: Gegenseitige Bewertung nach Fahrtabschluss
- **Statistiken**: Detaillierte Statistiken für Fahrer
- **Leaderboard**: Rangliste der Fahrer nach verschiedenen Kriterien

## 💻 Technische Anforderungen

- **Betriebssystem**: Windows 10 oder höher (oder macOS/Linux)
- **Docker**: Version 27 oder höher
- **RAM**: Mindestens 8 GB
- **Webbrowser**: Google Chrome oder ähnlicher moderner Browser
- **Internetverbindung**: Erforderlich für:
  - Routenberechnung (OpenStreetMap API)
  - 2FA-Codes per E-Mail
  - Weitere externe Dienste

## 🛠 Technologie-Stack

### Backend
- **Java 21**
- **Spring Boot 3.4.5**
- **Spring Security** (Authentifizierung & Autorisierung)
- **Spring Data JPA** (Datenbankzugriff)
- **PostgreSQL 16** (Datenbank)
- **WebSocket** (Echtzeit-Kommunikation)
- **Spring Mail** (E-Mail-Versand für 2FA)

### Frontend
- **Angular 19**
- **TypeScript**
- **PrimeNG** (UI-Komponenten)
- **TailwindCSS** (Styling)
- **Leaflet** (Kartenvisualisierung)
- **Chart.js** (Statistik-Diagramme)
- **STOMP.js** (WebSocket-Client)

### Infrastruktur
- **Docker** & **Docker Compose**
- **Nginx** (Frontend-Webserver)

## 🚀 Installation

### Voraussetzungen

1. **Docker Desktop** herunterladen und installieren
2. **Docker Account** erstellen und E-Mail verifizieren
3. **Docker Desktop** starten

### Installation mit Docker Images

1. **Images herunterladen** und den Speicherort merken
   - `backend.tar`
   - `frontend.tar`
   - `database.tar`

2. **Terminal öffnen** und zum Speicherort der Images navigieren

3. **Images laden**:
   ```bash
   docker load -i backend.tar
   docker load -i frontend.tar
   docker load -i database.tar
   ```

4. **Docker-Container starten**:
   ```bash
   # Volume für Datenbank erstellen
   docker volume create postgres-data
   
   # Netzwerk erstellen
   docker network create sep-network
   
   # PostgreSQL-Container starten
   docker run -d --name postgres --network sep-network \
     -e POSTGRES_DB=sepDrive \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=postgres \
     -p 5432:5432 \
     -v postgres-data:/var/lib/postgresql/data \
     postgres:16
   
   # Backend-Container starten
   docker run -d --name backendcontainer --network sep-network \
     -e SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/sepDrive \
     -e SPRING_DATASOURCE_USERNAME=postgres \
     -e SPRING_DATASOURCE_PASSWORD=postgres \
     -p 8080:8080 \
     gruppe-m-backend
   
   # Frontend-Container starten
   docker run -d --name frontendcontainer \
     -p 4200:80 \
     --network sep-network \
     gruppe-m-frontend
   ```

### Alternative: Installation mit Docker Compose

Falls Sie die Docker Images selbst bauen möchten:

```bash
docker-compose up -d
```

Dies startet alle Services automatisch:
- PostgreSQL auf Port `5432`
- Backend auf Port `8080`
- Frontend auf Port `4200`

### Anwendung starten

Nach erfolgreicher Installation die Anwendung im Browser öffnen:

```
http://localhost:4200
```

## 📖 Verwendung

### Registrierung und Login

1. **Registrierung**:
   - Auf "Register Now" klicken
   - E-Mail, Benutzername, Vor- und Nachname, Geburtsdatum eingeben
   - Optional: Profilbild hochladen
   - Rolle auswählen (Fahrer oder Kunde)
   - Als Fahrer: Fahrzeugklasse auswählen (klein, medium, deluxe)
   - 2FA-Code eingeben (wird per E-Mail versendet oder Supercode `999999` verwenden)

2. **Login**:
   - E-Mail und Passwort eingeben
   - 2FA-Code eingeben
   - Nach erfolgreichem Login gelangt man zum Dashboard

### Hauptfunktionen

#### Dashboard
- **Profil ansehen**: Zugriff auf das eigene Profil
- **Fahranfrage erstellen** (nur Kunden): Neue Fahranfrage erstellen
- **Aktive Fahranfrage** (nur Kunden): Aktuelle Fahranfrage einsehen
- **Fahrangebote** (nur Kunden): Angebote von Fahrern ansehen
- **Leaderboard**: Rangliste der Fahrer
- **Benutzersuche**: Nach anderen Benutzern suchen

#### Fahranfrage erstellen (Kunden)

1. Start und Ziel festlegen:
   - **Aktueller Standort**: Browser-Berechtigung erforderlich
   - **Koordinaten**: Manuell eingeben
   - **POI (Point of Interest)**: Restaurant, Theater, Museum suchen
   - **Adresse**: Adresse suchen und auswählen

2. **Zwischenstopps hinzufügen** (optional):
   - Über "Zwischenstopp hinzufügen" weitere Stopps hinzufügen
   - Mit "Entfernen" wieder löschen

3. **Fahrzeugklasse auswählen**: klein, medium oder deluxe

4. **Route planen**: Route vor dem Absenden anzeigen lassen

5. **Fahranfrage absenden**

**Hinweis**: Nur Fahrten innerhalb Deutschlands sind möglich.

#### Fahranfragen verwalten (Fahrer)

- Auf "Kunden Fahranfragen" klicken
- Tabelle mit allen Fahranfragen ansehen
- Spalten sortieren durch Klick auf die Kopfzeile
- **Aktuellen Standort angeben**: Für Entfernungsberechnung
- **Auf Fahrt bewerben**: Angebot abgeben
- **Angebot zurückziehen**: Bewerbung widerrufen
- **Chat öffnen**: Mit Kunden kommunizieren

**Wichtig**: 
- Nur auf Fahranfragen bewerben, die der eigenen Fahrzeugklasse entsprechen
- Bei Preisänderungen Kunden informieren
- Seite aktualisieren, um aktuelle Status zu sehen

#### Fahrangebote (Kunden)

- Angebote von Fahrern ansehen
- Tabelle sortieren
- Angebot **annehmen** oder **ablehnen**
- **Chat** mit Fahrer öffnen

#### Fahrt-Simulation

Nach Annahme eines Angebots können sowohl Kunde als auch Fahrer die Fahrt verfolgen:

- **Fahrt starten/pausieren/fortsetzen**
- **Simulationsgeschwindigkeit** anpassen (Regler)
- **Zwischenstopps hinzufügen/entfernen** (Kunde, nach Pause)
- **Ziel ändern** (Kunde, nach Pause)
- **Fahrt abschließen**: Bewertungsfenster erscheint

**Hinweis**: Fahrt kann nur gestartet werden, wenn ausreichendes Guthaben vorhanden ist.

#### Profil

- **Geldkonto**: Kontostand einsehen und aufladen
- **Fahrthistorie**: Alle abgeschlossenen Fahrten ansehen
  - Nach Namen suchen (Fahrer oder Kunde)
  - Suche zurücksetzen
- **Statistiken** (nur Fahrer):
  - Monatliche/tägliche Ansicht
  - Zeitraum auswählen
  - Diagrammtyp wählen

#### Chat

- Chathistorie ansehen (falls vorhanden)
- Nachrichten senden
- Nachrichten **bearbeiten** oder **löschen** (nur wenn ungelesen)
- Nach dem Lesen verschwinden Bearbeitungs-/Löschsymbole

#### Leaderboard

- Alle Fahrer nach verschiedenen Kriterien sortieren
- Nach Benutzername suchen
- Suche zurücksetzen

### Navigation

Die Navigationsleiste ist immer sichtbar (außer bei Login/Registrierung):

- **Start**: Zum Dashboard
- **Neue Fahranfrage** (nur Kunden): Fahranfrage erstellen
- **Fahrt-Simulation**: Zur Simulation
- **Kunden Fahranfragen** (nur Fahrer): Fahranfragen ansehen
- **Benutzername** (rechts): Zum eigenen Profil

## 📁 Projektstruktur

```
gruppe-m/
├── Backend/
│   └── drive/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/sep/drive/
│       │   │   │   ├── controller/     # REST-Controller
│       │   │   │   ├── service/        # Geschäftslogik
│       │   │   │   ├── repository/     # Datenbankzugriff
│       │   │   │   ├── config/         # Konfiguration
│       │   │   │   └── ...
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       └── pom.xml
├── Frontend/
│   └── src/
│       └── app/
│           ├── components/            # Wiederverwendbare Komponenten
│           ├── pages/                 # Seiten-Komponenten
│           ├── service/                # Services (API, WebSocket)
│           ├── models/                # TypeScript-Modelle
│           ├── core/                  # Guards, Models
│           └── ...
├── docker-compose.yml
└── README.md
```

## ✨ Funktionen

### Authentifizierung & Sicherheit
- ✅ Registrierung mit E-Mail-Verifizierung
- ✅ Login mit Passwort
- ✅ Zwei-Faktor-Authentifizierung (2FA) per E-Mail
- ✅ JWT-basierte Authentifizierung
- ✅ Rollenbasierte Zugriffskontrolle

### Fahranfragen
- ✅ Erstellung mit Start, Ziel und Zwischenstopps
- ✅ Verschiedene Eingabemethoden (Standort, Koordinaten, POI, Adresse)
- ✅ Routenplanung mit OpenStreetMap
- ✅ Fahrzeugklassenauswahl
- ✅ Aktive Fahranfrage verwalten

### Matching & Kommunikation
- ✅ Fahrer können sich auf Fahranfragen bewerben
- ✅ Kunden können Angebote annehmen/ablehnen
- ✅ Echtzeit-Chat zwischen Kunden und Fahrern
- ✅ Nachrichten bearbeiten und löschen (wenn ungelesen)

### Fahrt-Management
- ✅ Echtzeit-Fahrtsimulation
- ✅ Geschwindigkeitskontrolle
- ✅ Zwischenstopps während der Fahrt hinzufügen/entfernen
- ✅ Zieländerung während der Fahrt
- ✅ Automatische Bewertung nach Fahrtabschluss

### Weitere Features
- ✅ Bewertungssystem
- ✅ Zahlungssystem mit Guthaben
- ✅ Fahrthistorie
- ✅ Statistiken für Fahrer (Diagramme)
- ✅ Leaderboard
- ✅ Profilverwaltung mit Profilbild
- ✅ Benutzersuche

## 🔧 Entwicklung

### Backend entwickeln

```bash
cd Backend/drive
mvn spring-boot:run
```

Backend läuft auf `http://localhost:8080`

### Frontend entwickeln

```bash
cd Frontend
npm install
ng serve
```

Frontend läuft auf `http://localhost:4200`

### Tests ausführen

**Backend**:
```bash
cd Backend/drive
mvn test
```

**Frontend**:
```bash
cd Frontend
ng test
```

### Docker Images bauen

**Backend**:
```bash
cd Backend/drive
docker build -t gruppe-m-backend .
```

**Frontend**:
```bash
cd Frontend
docker build -t gruppe-m-frontend .
```

## ⚠️ Bekannte Einschränkungen

- Ausloggen ist derzeit nicht direkt möglich (Token muss manuell aus Local Storage gelöscht werden)
- Alternative: Inkognito-/Private Tab für neuen Account verwenden
- Bei Routenberechnungsfehlern: OpenStreetMap API-Verfügbarkeit prüfen

## 📝 Hinweise

- **Supercode für 2FA**: `999999` (für Entwicklung/Testing)
- **Docker-Befehle**: Bei Problemen beim Kopieren der Befehle aus der PDF, verwenden Sie die `docker-befehlte.txt` Datei
- **Bindestriche**: Beim Kopieren aus PDF können Bindestriche am Zeilenende fehlen - in diesem Fall Befehle manuell abtippen

## 📄 Lizenz

Dieses Projekt wurde im Rahmen eines Studienprojekts entwickelt.

## 👥 Kontakt

Bei Fragen oder Problemen wenden Sie sich bitte an das Entwicklungsteam.

---

**Viel Erfolg mit Gruppe M!** 🚗

