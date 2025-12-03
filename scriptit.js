(function () {
    const container = document.getElementById('calendar');
    if (!container) return;
    container.innerHTML = "";

    // Modal elements 
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalClose = modal ? modal.querySelector('.close') : null;

    // Audio holder
    let currentAudio = null;
    let lastOpenedBox = null;

    // Open modal with audio
    function openModal(num, messageHtml) {
        if (!modal) return;

        if (modalTitle) modalTitle.innerText = 'Luukku ' + num;
        if (modalText) modalText.innerHTML = messageHtml;
        modal.style.display = 'flex';

        // ---- AUDIO ----
        // Stop previous audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Start new audio (1.mp3, 2.mp3, …)
        currentAudio = new Audio('biisit/' + num + '.mp3');
        currentAudio.play().catch(err => {
            console.warn("Audio couldn't play:", err);
        });
    }

    // Close modal + stop audio
    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';

        // Stop audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        // Return last opened box to normal
        if (lastOpenedBox) {
            const num = lastOpenedBox.dataset.number;

            lastOpenedBox.classList.remove('visited');
            lastOpenedBox.setAttribute('aria-expanded', 'false');

            const content = lastOpenedBox.querySelector('.content');
            if (content) {
                content.innerHTML = "🎁 Day " + num;
                content.style.opacity = "0";
                content.style.transform = "scale(0.96)";
            }
            const number = lastOpenedBox.querySelector('.number');
            if (number) {
                number.style.fontWeight = "400";
            }
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Generate numbers 1-24
    const nums = Array.from({ length: 24 }, (_, i) => i + 1);

    // Shuffle
    for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
    }

    nums.forEach(n => {
        const box = document.createElement('button');
        box.className = 'box';
        box.type = 'button';
        box.setAttribute('data-number', n);
        box.setAttribute('aria-expanded', 'false');
        box.innerHTML = `
            <div class="number">${n}</div>
            <div class="content">🎁 Day ${n}</div>
        `;
        container.appendChild(box);
    });

    // Load progress
    let opened = parseInt(localStorage.getItem('joulukalenteri_opened') || '0', 10);
    if (isNaN(opened)) opened = 0;

    function getTodayNumber() {
        const now = new Date();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        if (month !== 12) return 0;
        return day;
    }

    function refresh() {
        document.querySelectorAll('.box').forEach(b => {
            const n = parseInt(b.dataset.number, 10);
            b.classList.remove('opened', 'disabled', 'visited');
            b.disabled = false;

            if (n == opened) {
                b.classList.add('opened');
                b.setAttribute('aria-expanded', 'true');

            } else if (n < opened) {
                b.classList.add('visited');
                b.setAttribute('aria-expanded', 'false');

            } else if (n !== opened + 1) {
                b.classList.add('disabled');
                b.disabled = true;
                b.setAttribute('aria-expanded', 'false');
            }
        });

        localStorage.setItem('joulukalenteri_opened', String(opened));
    }

    refresh();

    container.addEventListener('click', (e) => {
        const box = e.target.closest('.box');
        if (!box) return;

        const n = parseInt(box.dataset.number, 10);
        const todayAllowed = getTodayNumber();

        if (n > todayAllowed) {
            // shake animation
            box.animate(
                [
                    { transform: 'translateX(-6px)' },
                    { transform: 'translateX(6px)' },
                    { transform: 'translateX(0)' }
                ],
                { duration: 220 }
            );
            return;
        }

        // Reset previously opened
        document.querySelectorAll('.box.opened').forEach(b => {
            const num = b.dataset.number;
            const c = b.querySelector('.content');
            if (c) c.innerHTML = `🎁 Day ${num}`;
        });

        opened = n;
        lastOpenedBox = box;

        box.classList.add('opened');
        box.setAttribute('aria-expanded', 'true');

        const content = box.querySelector('.content');
        const message = `🎄 Tässä päivä ${n}!<br>Hauskaa joulunodotusta! 🎅🏻`;

        if (content) content.innerHTML = message;

        refresh();

        // IMPORTANT: pass HTML string, not element
        openModal(n, message);
    });
})();
