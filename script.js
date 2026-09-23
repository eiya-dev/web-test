(() => {
  'use strict';

  const CODE = '7384';
  const clues = {
    clock: {
      icon: '◷',
      name: '時計の記録',
      message: '時計は7時で止まっている。文字盤の「7」が、暗証番号の最初の数字らしい。',
      item: '最初の数字は 7'
    },
    shelf: {
      icon: '▤',
      name: '本棚の記録',
      message: '本の背表紙を左から読むと「三・八」。並び順が、そのまま2番目と3番目の数字になる。',
      item: '真ん中は 38'
    },
    drawer: {
      icon: '▣',
      name: '引き出しの記録',
      message: '紙切れに「部屋の四隅」とある。最後の数字は、この部屋の隅の数だ。',
      item: '最後の数字は 4'
    },
    desk: {
      icon: '·',
      message: '机の上には、薄く積もったほこりだけがある。ランプはもう点かない。'
    },
    door: {
      icon: '⌑',
      message: '重い扉だ。4桁の暗証番号を入力しないと開きそうにない。'
    }
  };

  const found = new Set();
  const hotspots = document.querySelectorAll('.hotspot');
  const messageText = document.getElementById('message-text');
  const messageIcon = document.getElementById('message-icon');
  const clueCount = document.getElementById('clue-count');
  const inventory = document.getElementById('inventory');
  const codePanel = document.getElementById('code-panel');
  const lockLabel = document.getElementById('lock-label');
  const codeForm = document.getElementById('code-form');
  const codeInput = document.getElementById('code-input');
  const unlockButton = document.getElementById('unlock-button');
  const feedback = document.getElementById('code-feedback');
  const overlay = document.getElementById('success-overlay');
  const resetButton = document.getElementById('reset-button');
  const playAgainButton = document.getElementById('play-again-button');

  function showMessage(icon, text) {
    messageIcon.textContent = icon;
    messageText.textContent = text;
    messageText.animate([
      { opacity: 0, transform: 'translateY(4px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 240, easing: 'ease-out' });
  }

  function updateLock() {
    const count = found.size;
    clueCount.textContent = `${count} / 3`;
    if (count === 3) {
      codePanel.classList.remove('is-locked');
      codePanel.classList.add('unlocked');
      lockLabel.textContent = '手がかりが揃った。暗証番号を入力してください';
      codeInput.disabled = false;
      unlockButton.disabled = false;
      codeInput.focus();
    }
  }

  function addClue(key) {
    if (found.has(key)) return;
    found.add(key);
    const clue = clues[key];
    const slot = inventory.children[found.size - 1];
    slot.classList.remove('empty');
    slot.classList.add('found');
    slot.innerHTML = `<span>${clue.icon}</span><small>${clue.item}</small>`;
    updateLock();
  }

  function inspect(objectName) {
    const clue = clues[objectName];
    if (!clue) return;
    showMessage(clue.icon, clue.message);
    if (clue.item) addClue(objectName);
  }

  hotspots.forEach((hotspot) => {
    hotspot.addEventListener('click', () => inspect(hotspot.dataset.object));
  });

  codeForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = codeInput.value.trim();
    if (input.length !== 4) {
      feedback.textContent = '4桁の数字を入力してください。';
      return;
    }
    if (input === CODE) {
      feedback.textContent = '';
      showMessage('✦', 'カチリ。鍵が開いた。外の空気が流れ込んでくる。');
      overlay.classList.add('visible');
      overlay.setAttribute('aria-hidden', 'false');
    } else {
      feedback.textContent = '鍵は動かない。集めた手がかりをもう一度整理しよう。';
      codeInput.select();
    }
  });

  function resetGame() {
    found.clear();
    codePanel.classList.remove('unlocked');
    lockLabel.textContent = '手がかりを3つ集めると入力できます';
    codeInput.value = '';
    codeInput.disabled = true;
    unlockButton.disabled = true;
    feedback.textContent = '';
    Array.from(inventory.children).forEach((slot) => {
      slot.className = 'inventory-slot empty';
      slot.innerHTML = '<span>?</span><small>未調査</small>';
    });
    clueCount.textContent = '0 / 3';
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    showMessage('◌', '目を覚ますと、見知らぬ部屋にいた。出口には4桁の鍵がかかっている。');
  }

  resetButton.addEventListener('click', resetGame);
  playAgainButton.addEventListener('click', resetGame);
})();
