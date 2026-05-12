const HANDSON_STORAGE_KEY = 'handson_user_data';

// Load existing data or initialize[cite: 1]
function getUserData() {
    const data = localStorage.getItem(HANDSON_STORAGE_KEY);
    return data ? JSON.parse(data) : { masteryScore: 0, modulesCompleted: [] };
}

function saveProgress(scoreIncrement) {
    let userData = getUserData();
    userData.masteryScore += scoreIncrement;
    localStorage.setItem(HANDSON_STORAGE_KEY, JSON.stringify(userData));
    updateUI();
}

function updateUI() {
    const data = getUserData();
    const scoreElement = document.getElementById('score-display');
    if (scoreElement) scoreElement.innerText = `${data.masteryScore}%`;
}

// Initial UI load[cite: 1]
document.addEventListener('DOMContentLoaded', updateUI);