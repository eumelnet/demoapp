import * as XLSX from 'xlsx';

const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vR8nZAAWK8TzaHAp8txeroZBRc8dhFCi2__dKw2Zpb1EDnRsWuiJqfaFiyYUQSVbgTKOZ3NNYOQa9m0/pub?output=csv";

async function fetchData() {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();

    // Wandeln CSV → Array mit SheetJS
    const workbook = XLSX.read(csvText, { type: 'string' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const headers = data[0];
    const rows = data.slice(1);

    return { headers, rows };
  } catch (err) {
    console.error("Fehler beim CSV-Fetch:", err);
    return null;
  }
}


  .catch(err => console.error(err));


async function processExcelData() {
    const excelData = await fetchData();
    if (!excelData) return;

    const workbook = XLSX.read(excelData, { type: 'array' });

    // Assuming the first sheet contains the data
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Assuming the first row is the header
    const headers = data[0];
    const rows = data.slice(1);

    return { headers, rows };
}

async function displayTeams() {
    const {headers, rows} = await processExcelData();
    if (!rows) return;

    const teams = [];
    const categoryIndex = headers.indexOf("Category");
    const teamNameIndex = headers.indexOf("Team Name");

    rows.forEach(row => {
      const category = row[categoryIndex];
      const teamName = row[teamNameIndex];
      if(category && teamName) {
        teams.push({category: category, name: teamName})
      }
    })

    const teamContainer = document.getElementById('team-container');
    const teamsByCategory = {};

    teams.forEach(team => {
        if (!teamsByCategory[team.category]) {
            teamsByCategory[team.category] = [];
        }
        teamsByCategory[team.category].push(team.name);
    });
  
    for (const category in teamsByCategory) {
        const categoryHeading = document.createElement('h3');
        categoryHeading.textContent = category;
        teamContainer.appendChild(categoryHeading);

        const teamList = document.createElement('ul');
        teamsByCategory[category].forEach(teamName => {
            const teamItem = document.createElement('li');
            teamItem.textContent = teamName;
            teamList.appendChild(teamItem);
        });
        teamContainer.appendChild(teamList);
    }
}

async function displayResults() {
  const { headers, rows } = await processExcelData();
    if (!rows) return;

    console.log("Headers in displayResults:", headers); // Debugging
    console.log("Rows in displayResults:", rows);       // Debugging

    if (!headers || !rows) {
        console.error("Headers or rows are undefined in displayResults.");
        return;
    }

    const resultsContainer = document.getElementById('results-container');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table header
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table rows
    rows.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultsContainer.appendChild(table);
}

async function displaySchedule() {
  const {headers, rows} = await processExcelData();
   if (!rows) return;

    console.log("Headers in displaySchedule:", headers); // Debugging
    console.log("Rows in displaySchedule:", rows);       // Debugging

    if (!headers || !rows) {
        console.error("Headers or rows are undefined in displaySchedule.");
        return;
    }

    const scheduleContainer = document.getElementById('schedule-container');
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table header
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const header = document.createElement('th');
        header.textContent = headerText;
        headerRow.appendChild(header);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table rows
    rows.forEach(rowData => {
        const row = document.createElement('tr');
        rowData.forEach(cellData => {
            const cell = document.createElement('td');
            cell.textContent = cellData;
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    scheduleContainer.appendChild(table);
}

// Call the functions to display data
displayTeams();
displayResults();
displaySchedule();
