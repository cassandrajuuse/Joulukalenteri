document.addEventListener("DOMContentLoaded", () => {
    const calendar = document.getElementById("calendar");
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");
    const closeBtn = document.querySelector(".close");

    // Hae tämän päivän numero (1–24)
    const today = new Date().getDate(); 

    // Tekstit 1–24
    const messages = [];
    for (let i = 1; i <= 24; i++) {
        if (i === 24) {
            messages.push("Hyvää Joulua");
        } else {
            const options = ["Hyvää joulunodotusta", "Iloista joulunodotusta"];
            const random = options[Math.floor(Math.random() * options.length)];
            messages.push(random);
        }
    }

    // Luo kalenterin ruudut
    for (let i = 1; i <= 24; i++) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.dataset.day = i;

        const number = document.createElement("div");
        number.classList.add("number");
        number.textContent = i;

        const content = document.createElement("div");
        content.classList.add("content");

        box.appendChild(number);
        box.appendChild(content);

        // Estä tulevat päivät
        if (i > today) {
            box.classList.add("disabled");
        }

        box.addEventListener("click", () => {
            if (i <= today) {
                openBox(i, box, content);
            }
        });

        calendar.appendChild(box);
    }

    // Avaa luukku
    function openBox(day, boxElement, contentElement) {
        const text = messages[day - 1];

        // POPUP sisältö
        modalTitle.textContent = "Luukku " + day;
        modalText.textContent = text;
        modal.style.display = "flex";

        // Sama laatikkoon
        boxElement.classList.add("opened");
        contentElement.textContent = text;
        boxElement.classList.add("visited");
    }

    // Sulje popup
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});