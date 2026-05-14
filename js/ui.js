export function setupUI(onLetterChangeCallback) {
    const lessonButtons = document.querySelectorAll('.lesson-btn');
    lessonButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            lessonButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const letter = btn.dataset.letter;
            document.getElementById('current-target-text').textContent = letter;
            const img = document.getElementById('reference-image');
            img.src = `./assets/reference/${letter}.png`;
            img.style.display = 'block';
            document.getElementById('placeholder-text').style.display = 'none';
            onLetterChangeCallback(letter);
        });
    });
}
export function updateFeedbackBadge(status) {
    const badge = document.getElementById('status-badge');
    badge.classList.remove('waiting', 'correct', 'incorrect');
    if (status === 'CORRECT') {
        badge.textContent = 'CORRECT';
        badge.classList.add('correct');
    } else if (status === 'INCORRECT') {
        badge.textContent = 'INCORRECT - Adjust hand';
        badge.classList.add('incorrect');
    } else {
        badge.textContent = 'Show your hand...';
        badge.classList.add('waiting');
    }
}