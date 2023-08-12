#include <Arduino.h>
#include <ESPmDNS.h>
#include <LittleFS.h>
#include <WebServer.h>
#include <WiFi.h>
#include <WiFiMulti.h>

WebServer server(80);
WiFiMulti wifiMulti;

// WiFi connect timeout per AP. Increase when connecting takes longer.
const uint32_t connectTimeoutMs = 10000;

void setup() {
    Serial.begin(115200);

    LittleFS.begin();

    wifiMulti.addAP("AP23 2.4", "thajo100320");
    wifiMulti.addAP("Acasa211", "denise40");
    // wifiMulti.addAP("AP23 2.4", "thajo100320");
    // wifiMulti.addAP("AP23 2.4", "thajo100320");
    // wifiMulti.addAP("AP23 2.4", "thajo100320");
    // wifiMulti.addAP("AP23 2.4", "thajo100320");

    if (wifiMulti.run() != WL_CONNECTED) {
        Serial.println("WiFi not connected!");
        delay(1000);
    }

    WiFi.hostname("IOTRELE");

    if (!MDNS.begin("IOTRELE")) {
        Serial.println("Error starting mDNS");
        return;
    }

    MDNS.addService("http", "tcp", 80);

    server.on("/", []() {
        // Abrir o arquivo para leitura
        File file = LittleFS.open("/index.html", "r");
        if (!file) {
            server.send(404, "text/plain", "Arquivo não encontrado");
            return;
        }

        // Enviar o conteúdo do arquivo para o cliente
        server.streamFile(file, "text/html");
        file.close();
    });

    server.on("/reles", []() {
        if (server.hasArg("rele1")) {
            if (server.arg("rele1").compareTo("ON")) {
                digitalWrite(02, LOW);
            } else if (server.arg("rele1").compareTo("OFF")) {
                digitalWrite(02, HIGH);
            }
        }
        
        if (server.hasArg("rele2")) {
            if (server.arg("rele2").compareTo("ON")) {
                digitalWrite(02, LOW);
            } else if (server.arg("rele2").compareTo("OFF")) {
                digitalWrite(02, HIGH);
            }
        }
        server.send(200);
    });

    server.serveStatic("/", LittleFS, "/");

    pinMode(02, OUTPUT);

    server.begin();
}

void loop() {
    server.handleClient();

    // if (wifiMulti.run(connectTimeoutMs) == WL_CONNECTED) {
    //     Serial.print("WiFi connected: ");
    //     Serial.print(WiFi.SSID());
    //     Serial.print(" ");
    //     Serial.println(WiFi.RSSI());
    // } else {
    //     Serial.println("WiFi not connected!");
    // }
}
