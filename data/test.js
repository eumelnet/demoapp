import * as XLSX from 'xlsx';

//const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8nZAAWK8TzaHAp8txeroZBRc8dhFCi2__dKw2Zpb1EDnRsWuiJqfaFiyYUQSVbgTKOZ3NNYOQa9m0/pub?output=csv&range=A1:E100";
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8nZAAWK8TzaHAp8txeroZBRc8dhFCi2__dKw2Zpb1EDnRsWuiJqfaFiyYUQSVbgTKOZ3NNYOQa9m0/pub?output=csv";

// CSV-URL - Stelle sicher, dass deine URL hier stimmt!
//const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRLz95_j6N8gJ8VDMIUpkY_5bRk7NLZqB3sNPQynB-qUECEBDG8TmPVLEoRO9W26g/pub?output=csv";

// CSV abrufen und parsen
async function fetchCSVData() {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP Fehler: ${response.status}`);
    }

    const csvText = await response.text();

    // CSV parsen mit PapaParse
    const parsed = Papa.parse(csvText, {
      header: true, // Wir nehmen an, die erste Zeile sind die Header
      skipEmptyLines: true, // Leere Zeilen überspringen
    });

    return parsed.data;
  } catch (err) {
    console.error("CSV Fetch Fehler:", err);
    return null;
  }
}

// Tabelle mit den CSV-Daten anzeigen
async function displayTable() {
  const rows = await fetchCSVData();
  if (!rows) return;

  const resultsContainer = document.getElementById('results-container');
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Headerzeile (aus den Feldern des ersten Eintrags)
  const headerRow = document.createElement('tr');
  const headers = Object.keys(rows[0]);
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Datenzeilen
  rows.forEach(row => {
    const rowElement = document.createElement('tr');
    headers.forEach(header => {
      const td = document.createElement('td');
      td.textContent = row[header] || '';  // Wenn keine Daten vorhanden sind, Leerzeichen setzen
      rowElement.appendChild(td);
    });
    tbody.appendChild(rowElement);
  });

  table.appendChild(tbody);
  resultsContainer.appendChild(table);
}

// Rufe die Funktion zum Anzeigen auf
displayTable();

