(function () {
  const container = document.getElementById('calendar');
  if (!container) return;
  container.innerHTML = "";

  // Modal elements 
  const modal = document.getElementById('modal');
  const modalTitle = document.getElementById('modalTitle');
  const modalText = document.getElementById('modalText');
  const modalClose = modal ? modal.querySelector('.close') : null;

  function openModal(num, messageHtml) {
    if (!modal) return;
    if (modalTitle) modalTitle.innerText = 'Luukku' + num;
    if ( modalText) modalText.innerHTML = messageHtml;
    modal.style.display = 'flex'
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
  }

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
  });

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
    // Template string with backticks
    box.innerHTML = `<div class="number">${n}</div><div class="content">🎁 Day ${n}</div>`;
    container.appendChild(box);
  });

  let opened = 0;
  // restore progress from localStorage
  const saved = parseInt(localStorage.getItem('joulukalenteri_opened') || '0', 10);
  if (!isNaN(saved) && saved > 0) {
    opened = saved;
  }

  function refresh() {
    document.querySelectorAll('.box').forEach(b => {
      const n = parseInt(b.dataset.number, 10);
      b.classList.remove('opened', 'disabled');
      b.disabled = false;

      if (n <= opened) {
        b.classList.add('opened');
        b.setAttribute('aria-expanded', 'true');
      } else if (n !== opened + 1) {
        b.classList.add('disabled');
        b.disabled = true;
        b.setAttribute('aria-expanded', 'false');
      } else {
        b.setAttribute('aria-expanded', 'false');
        b.disabled = false;
      }
    });
    localStorage.setItem('joulukalenteri_opened', String(opened));
  }

  refresh();

  container.addEventListener('click', (e) => {
    const box = e.target.closest('.box');
    if (!box) return;

    const n = parseInt(box.dataset.number, 10);
    if (n !== opened + 1) {
      // small shake feedback
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
    box.classList.add('opened');
    box.setAttribute('aria-expanded', 'true');

    const content = box.querySelector('.content');
    if (content) {
        content.innerHTML = '🎄 Tässä päivä ' + n + '!<br>Hauskaa joulunodotusta!';
    }

    const message = '🎄 Tässä päivä ' + n + '!<br>Hauskaa joulunodotusta!';

    refresh();
    openModal(n, content);
  });
})();
