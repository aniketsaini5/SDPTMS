function generateSessionOptions(startYear, count) {
    const select = document.getElementById("Session");
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // Months are 0-indexed

    // Determine the current session
    let activeStartYear;
    if (currentMonth >= 9) {
        activeStartYear = currentYear; // Current session starts this year
    } else {
        activeStartYear = currentYear - 1; // Current session starts last year
    }

    // Generate options
    for (let i = 0; i < count; i++) {
        const sessionStart = startYear + i;
        const sessionEnd = sessionStart + 1;
        const option = document.createElement("option");
        option.value = `${sessionStart}-${sessionEnd}`;
        option.textContent = `${sessionStart}-${sessionEnd}`;
        // Mark the active session
        if (sessionStart === activeStartYear) {
            option.selected = true; // This will select the current session
        }
        select.appendChild(option);
    }
}

// Generate session options from 2022 for 50 years
generateSessionOptions(2022, 50);