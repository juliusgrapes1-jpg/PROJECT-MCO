const API_BASE_URL = 'https://project-mco.onrender.com';

/* REGISTER USER */
async function registerUser() {
    const birthdate = document.getElementById("birthdate")?.value.trim();
    const idnum = document.getElementById("idnum")?.value.trim();
    const email = document.getElementById("email")?.value.trim();

    if (!birthdate || !idnum || !email) {
        alert("Please complete all fields.");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idnum, birthdate, email })
        });

        const data = await response.json();
        alert(data.message);
        if (response.ok) window.location.href = "index.html";
    } catch (err) {
        alert("Error connecting to server.");
    }
}

/* LOGIN USER */
async function validateLogin() {
    const username = document.getElementById("username")?.value.trim();
    const password = document.getElementById("password")?.value.trim();
    const errorMsg = document.getElementById("error-msg");

    try {
        const response = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            window.location.href = "Homepage.html";
        } else {
            if (errorMsg) errorMsg.textContent = data.message;
        }
    } catch (err) {
        if (errorMsg) errorMsg.textContent = "Server offline.";
    }
}

/* SAVE ATTENDANCE */
async function saveAttendance() {
    let rows = document.querySelectorAll(".attendance-table tbody tr");
    let eventName = document.querySelector(".left-meta .line")?.innerText.trim() || "General Event";

    let attendanceList = [];

    rows.forEach(row => {
        let cells = row.querySelectorAll("td");
        let name = cells[0]?.innerText.trim();
        if (name) {
            attendanceList.push({
                event: eventName,
                name,
                id: cells[1]?.innerText.trim(),
                birthdate: cells[2]?.innerText.trim(),
                email: cells[3]?.innerText.trim()
            });
        }
    });

    await fetch(`${API_BASE_URL}/api/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceList)
    });

    alert("Attendance Saved to Server!");
    window.location.href = "AttendanceRecords.html";
}

/* LOAD RECORDS PAGE */
async function loadRecords() {
    let table = document.getElementById("recordsTable");
    if (!table) return;

    const response = await fetch(`${API_BASE_URL}/api/records`);
    const data = await response.json();

    table.innerHTML = "";
    if (data.length === 0) {
        table.innerHTML = `<tr><td colspan="5">No records found</td></tr>`;
        return;
    }

    data.flat().forEach(item => {
        table.innerHTML += `
            <tr>
                <td>${item.event}</td>
                <td>${item.name}</td>
                <td>${item.id}</td>
                <td>${item.birthdate}</td>
                <td>${item.email}</td>
            </tr>
        `;
    });
}

function clearAttendance() {
    document.querySelectorAll("td[contenteditable]").forEach(td => td.innerText = "");
}

function searchRecords() {
    let input = document.getElementById("searchInput");
    if (!input) return;
    let filter = input.value.toLowerCase();
    let rows = document.querySelectorAll("#recordsTable tr");
    rows.forEach(row => {
        let name = row.cells[1]?.innerText.toLowerCase() || "";
        row.style.display = name.includes(filter) ? "" : "none";
    });
}

window.addEventListener("load", () => {
    if (document.getElementById("recordsTable")) loadRecords();
});
