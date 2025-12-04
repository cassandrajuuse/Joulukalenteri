(function () {
    const container = document.getElementById('calendar');
    if (!container) return;
    container.innerHTML = "";

    // --- MODAL / POPUP ---
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalText = document.getElementById('modalText');
    const modalClose = modal ? modal.querySelector('.close') : null;
    const modalImage = document.getElementById('modalImage'); // KUVA POPUPPIIN

    // --- AUDIO + VIIMEKSI AVATTU LAATIKKO ---
    let currentAudio = null;
    let lastOpenedBox = null;

    // --- LUUKKUJEN TEKSTIT ---
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

    // --- KUVIEN POLKU / NIMET ---
    // Muuta polku / pääte jos tarpeen (esim. 'images' tai '.png')
    function getImageSrcForDay(n) {
        return `kuvat/${n}.jpeg`;
    }

    // --- MODALIN AVAUS ---
    function openModal(num, messageHtml) {
        if (!modal) return;

        if (modalTitle) modalTitle.innerText = 'Luukku ' + num;

        // KUVA otsikon ja tekstin väliin
        if (modalImage) {
            const imgSrc = getImageSrcForDay(num);
            if (imgSrc) {
                modalImage.innerHTML = `<img src="${imgSrc}" alt="Luukku ${num} kuva">`;
            } else {
                modalImage.innerHTML = "";
            }
        }

        if (modalText) modalText.innerHTML = messageHtml;
        modal.style.display = 'flex';

        // Audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = new Audio('biisit/' + num + '.mp3');
        currentAudio.play().catch(() => {});
    }

    // --- MODALIN SULKU ---
    function closeModal() {
        if (!modal) return;
        modal.style.display = 'none';

        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        if (lastOpenedBox) {
            const num = lastOpenedBox.dataset.number;

            lastOpenedBox.classList.remove('opened');
            lastOpenedBox.classList.add('visited');
            lastOpenedBox.setAttribute('aria-expanded', 'false');

            const content = lastOpenedBox.querySelector('.content');
            const number = lastOpenedBox.querySelector('.number');

            // JÄTETÄÄN KUVA NÄKYVIIN LUUKKUUN, NUMERO PIILOON
            if (content) {
                const imgSrc = getImageSrcForDay(num);
                if (imgSrc) {
                    content.innerHTML = `<img src="${imgSrc}" alt="Luukku ${num} kuva">`;
                } else {
                    content.innerHTML = `🎁 Day ${num}`;
                }
                content.style.opacity = "1";
                content.style.transform = "scale(1)";
            }

            if (number) {
                number.style.visibility = 'hidden';
            }
        }
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    window.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // --- RANDOM-JÄRJESTYS ---
    const nums = Array.from({ length: 24 }, (_, i) => i + 1);
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

    // --- LOCALSTORAGE AVAUS ---
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

    // --- KLIKKAUS (scriptit.js + messages + kuvat) ---
    container.addEventListener('click', e => {
        const box = e.target.closest('.box');
        if (!box) return;

        const n = parseInt(box.dataset.number, 10);
        const todayAllowed = getTodayNumber();

        // liian aikaisin -> ravistus
        if (n > todayAllowed) {
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

        // (aiemmat opened-boksit säilyttävät nyt mahdolliset kuvansa,
        // joten ei enää ylikirjoiteta niiden .content-tekstiä takaisin)

        opened = n;
        lastOpenedBox = box;

        box.classList.add('opened');
        box.setAttribute('aria-expanded', 'true');

        const content = box.querySelector('.content');
        const number = box.querySelector('.number');
        const message = messages[n];
        const imgSrc = getImageSrcForDay(n);

        // TEKSTI EI NÄY LAATIKOSSA, VAIN POPUPISSA
        // LAATIKOSSA NÄYTETÄÄN KUVA ENSIMMÄISEN AVAUKSEN JÄLKEEN
        if (content) {
            if (imgSrc) {
                content.innerHTML = `<img src="${imgSrc}" alt="Luukku ${n} kuva">`;
            } else {
                content.innerHTML = `🎁 Day ${n}`;
            }
            content.style.opacity = "1";
            content.style.transform = "scale(1)";
        }

        // NUMERO PIILOON ENSIMMÄISEN AVAUKSEN JÄLKEEN
        if (number) {
            number.style.visibility = 'hidden';
        }

        refresh();

        // Popup: teksti (message) + kuva (openModal hoitaa kuvan)
        openModal(n, message);
    });

})();
