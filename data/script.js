import * as XLSX from 'xlsx';

// Replace with the actual URL of your Google Sheet (Published as CSV)

//const googleSheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTQrG3DGoGk8vXN5E_2LhR0-8mN6vOQ6jz1Cq5J2wcVjS0Q/pub?output=xlsx';
//const corsProxy = 'https://corsproxy.io/?';

const API_KEY = 'AIzaSyCLn7jAXNPZEdqCh4N3DkDsGeg4-PgTq30';
const SHEET_ID = '1Dxi1SBylvqnO7RaB5oZ5k9RL20qokh9vIuQOpR15Igk';
const RANGE = 'Sheet1!A1:D10';

fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
  .then(res => res.json())
  .then(data => {
    console.log(data.values);
  })
  .catch(err => console.error(err));


async function fetchData() {
    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`)
	  .then(res => res.json())
	  .then(data => {
  	  console.log(data.values);
 	 })
	  .catch(err => console.error(err));

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const buffer = await response.arrayBuffer();
        return buffer;
    } catch (error) {
        console.error('Fetching error:', error);
        return null;
    }
}

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
