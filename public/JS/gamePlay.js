"use strict";

// ===== GLOBAL VARIABLES =====
let balance = 1000;        // starting balance
let betPerSpin = 10;       // default bet
let auto = false;
let numAutoSpins = 0;
let canSpin = true;

// grab canvas and context (assumes canvas id="slotCanvas" in HTML)
const canvas = document.getElementById("slotCanvas");
const ctx = canvas.getContext("2d");
const cWidth = canvas.width;
const cHeight = canvas.height;

// store reels info
const numReels = 5;
const numRows = 3;
let tileSize = cHeight / numRows;
let reels = [];
let finalOutcome = [];
let finalTiles = [];
let loadedImages = {};  // keys: symbols, values: Image objects

// ===== BALANCE DISPLAY =====
function updateBalanceUI() {
  const balanceEl = document.getElementById("player-balance");
  if (balanceEl) balanceEl.innerText = balance;
}

// ===== SPIN GAME =====
export function spinGame() {
  if (!canSpin) return;
  if (balance < betPerSpin) return alert("Insufficient funds!");
  balance -= betPerSpin;
  updateBalanceUI();
  canSpin = false;

  createOutcome();
  animateReels();
}

// ===== AUTOPLAY =====
export function toggleAutoplay(numSpins = 10) {
  if (!canSpin) return;
  auto = true;
  numAutoSpins = numSpins;

  function nextSpin() {
    if (!auto || numAutoSpins <= 0) {
      auto = false;
      return;
    }
    spinGame();
    numAutoSpins--;
    setTimeout(nextSpin, 2500); // adjust delay to match spin animation
  }
  nextSpin();
}

// ===== CREATE OUTCOME =====
function createOutcome() {
  finalOutcome = [];
  finalTiles = [];
  for (let i = 0; i < numReels; i++) {
    let reelTiles = [];
    let reelKeys = [];
    for (let j = 0; j < numRows; j++) {
      const keys = Object.keys(loadedImages);
      const randIndex = Math.floor(Math.random() * keys.length);
      reelTiles.push(loadedImages[keys[randIndex]]);
      reelKeys.push(keys[randIndex]);
    }
    finalOutcome.push(reelTiles);
    finalTiles.push(reelKeys);
  }
}

// ===== ANIMATE REELS (3D EFFECT) =====
function animateReels() {
  let vPos = Array(numReels).fill(0);
  let speeds = Array(numReels).fill(30);
  const deceleration = 0.95;
  const maxVPos = tileSize * numRows;

  function frame() {
    ctx.clearRect(0, 0, cWidth, cHeight);

    for (let r = 0; r < numReels; r++) {
      for (let row = 0; row < numRows; row++) {
        let symbolIndex = row;
        const img = finalOutcome[r][symbolIndex];

        // 3D effect: scale tiles near top/bottom
        let scale = 1 - Math.abs(row - numRows / 2 + vPos[r] / tileSize) / (numRows * 2);
        let size = tileSize * scale;
        let x = r * tileSize;
        let y = row * tileSize - vPos[r] % tileSize + (tileSize - size) / 2;

        ctx.save();
        ctx.globalAlpha = scale; // fade edges
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
      }

      // increment vertical position
      if (vPos[r] < maxVPos) {
        vPos[r] += speeds[r];
      } else {
        speeds[r] *= deceleration;
      }
    }

    // check if all reels have stopped
    if (vPos.every((v, i) => v >= maxVPos && speeds[i] < 0.5)) {
      canSpin = true;
      triggerWinEffect();
      if (auto) toggleAutoplay(numAutoSpins);
    } else {
      requestAnimationFrame(frame);
    }
  }

  frame();
}

// ===== WINNING EFFECTS =====
function triggerWinEffect() {
  // Example: +10 balance per spin randomly
  const winnings = Math.floor(Math.random() * 50);
  balance += winnings;
  updateBalanceUI();

  // Coin/confetti effect (simplified)
  if (typeof confetti === "function") confetti();
}
