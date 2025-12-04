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
      1: "Joulun aamu herättää Auroran pehmeään valoon,<br>kuin unelma, joka jatkuu vielä hereilläkin.<br>Hän kulkee hiljaa linnansa käytävillä ja hymyilee talven rauhalle.",
      2: "Muumipappa kirjoittaa muistikirjaansa joulun tarinoita.<br>Höyryävä tee ja takkatuli pitävät hänelle seuraa,<br>ja mieli täyttyy menneiden seikkailujen lämpimästä kaiusta.",
      3: "Jasmine seisoo palatsin parvekkeella ja katsoo talviyöhön.<br>Taikamatto leijailee hänen vierellään kuin vanha ystävä.<br>“On ihmeellistä, miten tähdetkin tuntuvat juhlivan”, hän kuiskaa.",
      4: "Nuuskamuikkunen vaeltaa lumipolkuja ja kuuntelee hiljaista metsää.<br>Hän virittää huuliharppunsa ja antaa sävelen lentää.<br>Joulun rauha syntyy hetkistä, joita ei tarvitse selittää.",
      5: "Pikachu hyppelee lumessa, poskissaan lämmin kipinä.<br>Hän piirtää sähköllä ilmaan joulutähden,<br>joka tuikahtaa kirkkaana talvi-illassa.",
      6: "Pocahontas kulkee talvituulessa, joka kantaa tarinoita.<br>Jokainen hiutale kertoo oman matkansa.<br>Hän kuuntelee luontoa ja vastaa sen lempeään kutsuun.",
      7: "Nipsu tarkistaa lahjapaketit monta kertaa, varmuuden vuoksi.<br>Hän hyräilee itsekseen ja yrittää olla pelkäämättä yllätyksiä.<br>Jouluna hänkin löytää rohkeuden pienen ilon kautta.",
      8: "Muksis istuu kuusen juurella ja tutkii koristeita uteliain silmin.<br>Hän hymyilee lempeästi ja heiluttaa pyöreitä korviaan.<br>Joulussa hän näkee ystävyyden hiljaisen voiman.",
      9: "Mikki järjestää joulun valmistelut tarkasti ja iloisin mielin.<br>Hän sytyttää kuusen valot ja kutsuu kaikki juhlimaan.<br>Hänen hymynsä saa koko huoneen näyttämään lämpimämmältä.",
      10: "Muumimamma levittää pöydälle joulun herkkuja ja lempeää rauhaa.<br>Hänen köökissään tuoksuu turvallisuus.<br>Hän tietää, että tärkeintä on yhdessäolo.",
      11: "Eevee pomppii lumihankeen ja muuttaa muotoaan talvituulen tahtiin.<br>Sen häntä pöllyttää valkoisia lumipilviä ilmaan.<br>Joulu on Eeveelle seikkailu, joka alkaa jokaisesta tassunjäljestä.",
      12: "Mummi kutoo joulusukkia ja hyräilee tuttua melodiaa.<br>Hän katsoo ikkunoista ulos ja toivoo kaikille lämpöä.<br>Hänen joulunsa on täynnä lempeää huolenpitoa.",
      13: "Muumipeikko rakentaa lumiukon ja hymyilee talven ihmeelle.<br>Hän kaipaa jo kevättä, mutta joulun taika saa sydämen läikähtämään.<br>Tärkeintä on, ettei lumiukko jää yksin.",
      14: "Pahatar kulkee mustien siipiensä varassa yli talvisen metsän.<br>Hänen katseensa on terävä, mutta hän näkee kauneuden hiljaisuudessa.<br>Jopa varjoissa voi syntyä joulun loisto.",
      15: "Ponit ravistelevat harjaansa ja päästävät ilmoille kimmeltävän lumisateen.<br>Ne laukkaavat riemulla läpi talvipäivän.<br>Joulu on heille värikäs juhla ystävyyden taivaalla.",
      16: "Cruella kulkee kaupungin kaduilla talvitakki hulmuten.<br>Hän miettii, miten tehdä joulusta mahdollisimman näyttävä.<br>Lopulta hän huomaa, että joskus pienikin loiste riittää.",
      17: "Niiskuneiti pukeutuu kimaltavaan rusettiin ja hymyilee talvikuulle.<br>Hän rakastaa joulun kauneutta ja rauhaa.<br>Kaikkein eniten hän odottaa halauksia.",
      18: "Pascal piiloutuu kuusen oksille ja vaihtaa väriään kuusenkoristeiden mukaan.<br>Vain hänen pienet silmänsä vilkkuvat vihreän takaa.<br>Hän tietää, että joulu on hyvä hetki tarkkailla maailmaa.",
      19: "Pikkumyy kirmaisee lumihangessa ja päättää valloittaa talvipäivän.<br>Hänen rohkeutensa saa lumihiutaleetkin tanssimaan nopeammin.<br>Missä Myy kulkee, siellä joulun energia herää eloon.",
      20: "Sebastian harjoittelee joululaulua, vaikka kylmyys nipistelee saksia.<br>Hän johtaa kuoroa punaisena kuin joulutähti.<br>Meri soi hänen sydämessään aina.",
      21: "Stitch tarkastelee joulukuusta pää kallellaan ja yrittää käyttäytyä parhaansa mukaan.<br>Hän haluaa oppia, mitä rauha oikein tarkoittaa.<br>Ehkä se on kuusen valojen lempeää sykkimistä.",
      22: "Mörkö seisoo hiljaisessa lumessa ja kuuntelee yötä.<br>Hän ei sano mitään, mutta lumi hohtaa kirkkaammin hänen läsnäolossaan.<br>Joulun taika on joskus hyvin, hyvin hiljaista.",
      23: "Gena soittaa harmonikkaansa rauhallisesti ja antaa sävelten kantaa yli lumisten kattojen.<br>Muksis istuu vieressä ja kuuntelee lumoutuneena.<br>Heidän joulunsa on ystävyyden laulua.",
      24: "Anastasia kulkee lumisateessa ja kerää rohkeutta kohti uusia unelmia.<br>Menneet muistot tanssivat kevyesti hänen ympärillään.<br>Jouluyönä hän tuntee, että jokainen tarina saa mahdollisuuden jatkua."
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


