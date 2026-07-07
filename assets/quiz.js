(() => {
  const items = document.querySelectorAll("[data-quiz-answer]");
  items.forEach((item) => {
    const answer = item.getAttribute("data-quiz-answer");
    const note = item.getAttribute("data-quiz-note") || "";
    const feedback = item.querySelector(".feedback");
    item.querySelectorAll("button[data-choice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const choice = btn.getAttribute("data-choice");
        const ok = choice === answer;
        if (!feedback) return;
        feedback.textContent = ok ? `Correct. ${note}` : `Not yet. ${note}`;
        feedback.className = `feedback ${ok ? "good" : "bad"}`;
      });
    });
  });
})();
