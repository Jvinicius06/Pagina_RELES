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

#define NRELES 8

#define LIGADO LOW
#define DESLIGADO HIGH

const uint8_t pinReles[NRELES] = {18, 19, 21, 22, 23, 15, 2, 4};

void setup() {
    Serial.begin(115200);

    LittleFS.begin();

    wifiMulti.addAP("Automacao", "10203040");
    // wifiMulti.addAP("AP23 2.4", "thajo100320");
    wifiMulti.addAP("Acasa211", "denise40");

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
        // Enviar o conteúdo do arquivo para o cliente com tipo HTML
        server.streamFile(file, "text/html");
        file.close();
    });

    server.on("/reles", []() {
        String releAtual;
        for (size_t i = 0; i < NRELES; i++) {
            releAtual = "rele" + String(i + 1);
            if (server.hasArg(releAtual)) {
                if (server.arg(releAtual).equals("ON")) {
                    digitalWrite(pinReles[i], LIGADO);
                } else if (server.arg(releAtual).equals("OFF")) {
                    digitalWrite(pinReles[i], DESLIGADO);
                }
            }
        }

        String response;
        for (size_t i = 0; i < NRELES; i++) {
            if (i > 0) response += "&";
            response += "rele" + String(i + 1);
            response += "=";
            if (digitalRead(pinReles[i]) == LIGADO) {
                response += "ON";
            } else {
                response += "OFF";
            }
        }
        server.send(200, "text/plain", response);
    });

    server.serveStatic("/", LittleFS, "/");

    for (uint8_t pin : pinReles) {
        pinMode(pin, OUTPUT);
        digitalWrite(pin, DESLIGADO);
    }

    server.enableCORS(true);
    server.begin();
}

uint8_t lastMode = 0xff;

void loop() {
    server.handleClient();
    uint8_t mode;
    if (lastMode != (mode = wifiMulti.run(connectTimeoutMs))) {
        lastMode = mode;
        if (lastMode == WL_CONNECTED) {
            Serial.print("WiFi connected: ");
            Serial.print(WiFi.SSID());
            Serial.print(" ");
            Serial.print(WiFi.localIP());
            Serial.print(" ");
            Serial.println(WiFi.RSSI());
        } else {
            Serial.println("WiFi not connected!");
        }
    }
}
