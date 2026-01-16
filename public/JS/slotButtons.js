 // slotButtons.js
import { spinGame, toggleAutoplay } from './gameplay.js';

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  switch (data.action) {
    case "spin":
      spinGame();
      break;
    case "toggleAutoplay":
      toggleAutoplay(data.spins || 10);
      break;
    case "addBalance":
      if (typeof window.balance !== "undefined") {
        window.balance += data.amount;
        const balanceEl = document.getElementById("player-balance");
        if (balanceEl) balanceEl.innerText = window.balance;
      }
      break;
  }
});
 
