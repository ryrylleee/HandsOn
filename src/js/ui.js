// src/js/ui.js

export function setupUI(onLetterChangeCallback) {
    const keyboard = document.getElementById('keyboard');
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

    letters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        
        btn.addEventListener('click', () => {
            // Update active styling
            document.querySelectorAll('.letter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Target Text
            document.getElementById('current-target-text').textContent = letter;

            // Update Image (Ensure you have A.png, B.png in your assets folder)
            const imgEl = document.getElementById('reference-image');
            imgEl.src = `./assets/reference/${letter}.png`; // or .jpg
            imgEl.style.display = 'block';
            document.getElementById('placeholder-text').style.display = 'none';

            // Tell main.js the target changed
            onLetterChangeCallback(letter);
        });

        keyboard.appendChild(btn);
    });
}

export function updateFeedbackBadge(status) {
    const badge = document.getElementById('status-badge');
    
    // Clear old classes
    badge.classList.remove('waiting', 'correct', 'incorrect');

    if (status === 'CORRECT') {
        badge.textContent = "CORRECT";
        badge.classList.add('correct');
    } else if (status === 'INCORRECT') {
        badge.textContent = "INCORRECT - Adjust your hand";
        badge.classList.add('incorrect');
    } else {
        badge.textContent = "Show your hand...";
        badge.classList.add('waiting');
    }
}