document.addEventListener('DOMContentLoaded', function () {
    // Toggle hamburger menu
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const navItem = document.querySelector('.nav .item');
    if (hamburgerMenu && navItem) {
        hamburgerMenu.addEventListener('click', function () {
            navItem.classList.toggle('show');
            this.classList.toggle('change');
        });
    }

    // Scroll to department section
    const departmentButton = document.querySelector('.nav .item a[href="#department"]');
    if (departmentButton) {
        departmentButton.addEventListener('click', function (event) {
            event.preventDefault();
            const target = this.getAttribute('href');
            document.querySelector(target).scrollIntoView({ behavior: 'smooth' });
            navItem.classList.remove('show'); // Close the menu after clicking on a link
            hamburgerMenu.classList.remove('change'); // Reset hamburger icon
        });
    }
});



const hamburgerMenu = document.querySelector('.hamburger-menu');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.overlay');
const closeBtn = document.querySelector('.close-btn');

// Toggle sidebar visibility when hamburger menu is clicked
hamburgerMenu.addEventListener('click', function () {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
});

// Close the sidebar when the close button or overlay is clicked
closeBtn.addEventListener('click', function () {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
});

overlay.addEventListener('click', function () {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
});



const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");
sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

