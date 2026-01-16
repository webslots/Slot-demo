"use strict";

let balance = 1000;
let jackpots = [50000, 10000, 20000]; // example for 3 slots
let auto = false;
let numAutoGames = 0;
let canSpin = true;
let finalBalance = balance;
let winningLines = [];
let winningReels = [];
let finalTiles = [];
let finalOutcome = [];
let payoutSum = 0;

// --- SHARED BALANCE UPDATES ---
function updateBalance(newBalance) {
  balance = newBalance;
  finalBalance = balance;
  // Send message back to Elementor
  window.parent.postMessage({ action: "updateBalance", amount: balance }, "*");
}

// --- JACKPOT UPDATE ---
function updateJackpot(slotNum, amount) {
  jackpots[slotNum - 1] = amount;
  window.parent.postMessage({ action: "updateJackpot", slot: slotNum, amount: amount }, "*");
}

// --- WIN EFFECTS ---
function triggerWinEffect() {
  window.parent.postMessage({ action: "winEffect" }, "*");
}

// --- SPIN FUNCTION ---
function spinSlots() {
  if (!canSpin) return;
  canSpin = false;

  // Check bet & balance here (simplified for demo)
  if (balance <= 0) {
    console.log("Insufficient balance");
    canSpin = true;
    return;
  }
  balance -= 10; // fixed bet
  updateBalance(balance);

  // Generate outcome
  createOutcome();
  findWinners();

  // Animate reels
  slideTile();
}

// --- CREATE RANDOM OUTCOME ---
function createOutcome() {
  finalOutcome = [];
  finalTiles = [];
  const numReels = 5;
  const nTilesPerCol = 3;
  const numPics = 8;
  for (let i = 0; i < numReels; i++) {
    let colTiles = [];
    let colKeys = [];
    for (let j = 0; j < nTilesPerCol; j++) {
      const p = Math.floor(Math.random() * numPics);
      colTiles.push(p); // use index of symbol for demo
      colKeys.push(p);
    }
    finalOutcome.push(colTiles);
    finalTiles.push(colKeys);
  }
}

// --- MULTI-PAYLINE WINNERS ---
function findWinners() {
  winningLines = [];
  winningReels = [];
  const numLines = 3; // example
  for (let lineNum = 0; lineNum < numLines; lineNum++) {
    const line = finalTiles.map(col => col[lineNum % col.length]);
    const set = new Set(line);
    if (set.size === 1) {
      winningLines.push(lineNum);
      winningReels.push(line.length);
      const payout = line.length * 10; // example payout
      balance += payout;
      updateBalance(balance);
      triggerWinEffect();
    }
  }
}

// --- AUTOPLAY ---
function toggleAutoplay(spins = 10) {
  if (auto) return;
  numAutoGames = spins;
  auto = true;
  autoPlayLoop();
}

function autoPlayLoop() {
  if (numAutoGames <= 0) {
    auto = false;
    return;
  }
  if (canSpin) {
    spinSlots();
    numAutoGames--;
    setTimeout(autoPlayLoop, 1200); // delay between spins
  } else {
    requestAnimationFrame(autoPlayLoop);
  }
}

// --- SLIDE TILE / 3D REEL EFFECT ---
function slideTile() {
  const numReels = finalTiles.length;
  const nTilesPerCol = finalTiles[0].length;
  const reelSpeed = 20;
  let positions = Array(numReels).fill(0);
  function animateReels() {
    let stillSpinning = false;
    for (let i = 0; i < numReels; i++) {
      positions[i] += reelSpeed;
      if (positions[i] < 300) { // demo reel height
        stillSpinning = true;
      }
      // Normally draw reels here with 3D perspective
    }
    if (stillSpinning) {
      requestAnimationFrame(animateReels);
    } else {
      canSpin = true;
    }
  }
  requestAnimationFrame(animateReels);
}
