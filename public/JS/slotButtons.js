// SlotButtons.js V6 Hyper Pro
"use strict";

// Listen for messages from parent Elementor widget
window.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || typeof data !== "object") return;

  // Spin slot
  if (data.action === "spin") {
    if (typeof spinSlots === "function") spinSlots();
  }

  // Toggle autoplay
  if (data.action === "toggleAutoplay") {
    if (typeof toggleAutoplay === "function") toggleAutoplay(data.spins || 10);
  }
});
