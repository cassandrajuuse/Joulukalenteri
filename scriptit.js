(function () {
    const container = document.getElementById('calendar');
    if (!container) return;
    container.innerHTML = "";

    // --------------------------
    //  MESSAGES (LISÄTTY SKRIPTI.JS:STÄ)
    // --------------------------
    const messages = {
        1: "Luukku 1 – ihanaa joulun odotusta!",
        2: "Luukku 2 – mukavaa päivää!",
        3: "Luukku 3 – joulufiilis kasvaa!",
        4: "Luukku 4 – lämmintä mieltä!",
        5: "Luukku 5 – hymyile tänään!",
        6: "Luukku 6 – vähän jo lunta?",
        7: "Luukku 7 – rentoa joulutunnelmaa!",
        8: "Luukku 8 – tee jotain kivaa!",
        9: "Luukku 9 – joulua kohti!",
        10: "Luukku 10 – valoisaa päivää!",
        11: "Luukku 11 – olet tärkeä!",
        12: "Luukku 12 – puolivälissä jo!",
        13: "Luukku 13 – Lucia tuo valoa!",
        14: "Luukku 14 – lämpimiä ajatuksia!",
        15: "Luukku 15 – ehkä pipareita?",
        16: "Luukku 16 – glögi lämmittää!",
        17: "Luukku 17 – joulu lähestyy!",
        18: "Luukku 18 – olet mahtava!",
        19: "Luukku 19 – viimeiset päivät!",
        20: "Luukku 20 – tontut kurkkii!",
        21: "Luukku 21 – melkein jo aatto!",
        22: "Luukku 22 – lahjapaniikki?",
        23: "Luukku 23 – viimeinen ilta!",
        24: "Luukku 24 – HYVÄÄ JOULUA! 🎄❤️"
    };

    // --------------------------

    // Modal elements
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalClose = modal ? modal.querySelector('.close') : null;

    // Audio holder
    let currentAudio = null;
    let lastOpenedBox = null;

    // Open modal with audio
    function openModal(num, text) {
        modalTitle.innerText = "Luukku " + num;
        modalText.innerHTML = text;
        modal.style.display = "flex";

        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        const audioPath = `biisit/${num}.mp3`;
        currentAudio = new Audio(audioPath);
        currentAudio.play().catch(() => { });
    }

    function closeModal() {
        modal.style.display = "none";
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
        }

        if (lastOpenedBox) {
            lastOpenedBox.setAttribute("aria-expanded", "false");
            lastOpenedBox.classList.remove("opened");
            lastOpenedBox.classList.add("visited");

            const number = lastOpenedBox.querySelector('.number');
            const content = lastOpenedBox.querySelector('.content');

            if (content) {
                const n = lastOpenedBox.dataset.day;
                content.innerHTML = `🎁 Day ${n}`;
                content.style.opacity = "0";
                content.style.transform = "translateY(10px)";
            }
            if (number) number.style.fontWeight = "400";
        }
    }

    if (modalClose) modalClose.addEventListener("click", closeModal);
    window.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });

    let opened = parseInt(localStorage.getItem('joulukalenteri_opened') || '0', 10);
    if (isNaN(opened)) opened = 0;

    function refresh() {
        const today = new Date();
        const day = today.getDate();

        const boxes = container.querySelectorAll('.box');
        boxes.forEach(box => {
            const num = parseInt(box.dataset.day, 10);
            const content = box.querySelector('.content');

            if (num <= opened) {
                box.classList.add('visited');
                box.classList.remove('opened');
                if (content) content.innerHTML = `🎁 Day ${num}`;
                box.setAttribute("aria-expanded", "false");
            } else if (num > day) {
                box.classList.add('disabled');
                box.setAttribute("aria-expanded", "false");
            }
        });
    }

    // Build calendar
    for (let i = 1; i <= 24; i++) {
        const box = document.createElement('button');
        box.className = "box";
        box.dataset.day = i;
        box.setAttribute("aria-expanded", "false");

        const numDiv = document.createElement('div');
        numDiv.className = "number";
        numDiv.innerText = i;

        const contentDiv = document.createElement('div');
        contentDiv.className = "content";
        contentDiv.innerHTML = `🎁 Day ${i}`;

        box.appendChild(numDiv);
        box.appendChild(contentDiv);
        container.appendChild(box);
    }

    refresh();

    // Click handler
    container.querySelectorAll('.box').forEach(box => {
        box.addEventListener('click', () => {
            const n = parseInt(box.dataset.day, 10);

            if (box.classList.contains('disabled')) return;

            // Reset old opened
            const allBoxes = container.querySelectorAll('.box.opened');
            allBoxes.forEach(b => {
                const num = b.dataset.day;
                const c = b.querySelector('.content');
                if (c) c.innerHTML = `🎁 Day ${num}`;
                b.classList.remove('opened');
                b.classList.add('visited');
                b.setAttribute('aria-expanded', 'false');
            });

            lastOpenedBox = box;

            box.classList.add('opened');
            box.setAttribute('aria-expanded', 'true');

            const content = box.querySelector('.content');
            const message = messages[n];   // <-- KÄYTETÄÄN MESSAGES-OLIOTA

            if (content) content.innerHTML = message;

            refresh();

            openModal(n, message);
        });
    });
})();
