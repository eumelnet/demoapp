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
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data.values);

        const worksheet = XLSX.utils.aoa_to_sheet(data.values);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
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


// Call the functions to display data
displayTeams();
