(function () {
    const container = document.getElementById('calendar');
    if (!container) return;
    container.innerHTML = "";

    // --- POPUP ---
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalClose = modal ? modal.querySelector('.close') : null;

    function openModal(num, text) {
        modalTitle.innerText = "Luukku " + num;
        modalText.innerHTML = text;
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- LUUKKUJEN TEKSTIT ---
    const messages = {};
    for (let i = 1; i <= 24; i++) {
        if (i === 24) {
            messages[i] = "Hyvää joulua! 🎄✨";
        } else {
            messages[i] = (i % 2 === 0)
                ? "Iloista joulunodotusta! 🎅🏻"
                : "Hyvää joulunodotusta! ❄️";
        }
    }

    // --- TEHDÄÄN 24 LAATIKKOA ---
    const nums = Array.from({ length: 24 }, (_, i) => i + 1);

    // shuffle
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

    // --- AUKAISEMINEN JA SÄILYTYS ---
    let opened = parseInt(localStorage.getItem('joulukalenteri_opened') || '0', 10) || 0;

    function getTodayNumber() {
        const now = new Date();
        if (now.getMonth() + 1 !== 12) return 0;
        return now.getDate();
    }

    function refresh() {
        document.querySelectorAll('.box').forEach(b => {
            const n = parseInt(b.dataset.number, 10);
            b.classList.remove('opened', 'disabled', 'visited');
            b.disabled = false;

            if (n === opened) {
                b.classList.add('opened');
                b.setAttribute("aria-expanded", "true");
            } else if (n < opened) {
                b.classList.add('visited');
            } else if (n !== opened + 1) {
                b.classList.add('disabled');
                b.disabled = true;
            }
        });
        localStorage.setItem('joulukalenteri_opened', String(opened));
    }
    refresh();

    // --- KLIKKAUS ---
    container.addEventListener('click', (e) => {
        const box = e.target.closest('.box');
        if (!box) return;

        const n = parseInt(box.dataset.number, 10);
        const today = getTodayNumber();

        if (n > today) {
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

        opened = n;

        const boxContent = box.querySelector('.content');
        const msg = messages[n];    // haetaan oikea teksti taulukosta

        // Päivitetään laatikon sisältö
        boxContent.innerHTML = msg;

        refresh();

        // Avataan popup samalla tekstillä
        openModal(n, msg);
    });
})();
