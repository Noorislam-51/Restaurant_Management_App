
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("authPopup");
  const openLogin = document.getElementById("openLogin");
  const openSignup = document.getElementById("openSignup");
  const closePopup = document.getElementById("closePopup");

  openLogin.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("tab-1").checked = true;
    modal.style.display = "block";
  });

  openSignup.addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("tab-2").checked = true;
    modal.style.display = "block";
  });

  closePopup.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const menuCards = document.querySelectorAll('.menu-card');

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedCategory = button.getAttribute('data-filter');

    // Toggle active button style
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    menuCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (selectedCategory === 'All' || cardCategory === selectedCategory) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
