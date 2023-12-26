// Copyright 2023 Carmine Libroia
//      This file is part of "Movie Tickets".
//      "Movie Tickets" is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation,
//      either version 3 of the License, or (at your option) any later version.
//      "Movie Tickets" is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
//      FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.
//      You should have received a copy of the GNU General Public License along with "Movie Tickets". If not, see <https://www.gnu.org/licenses/>.

//Global
let selectedSeats = 0;
const ticketPrice = 10.00;
let total = 0;

function displaySidebar(sidebar, device, toggle) {
    let classes = [];
    //True -> Desktop; False -> Mobile
    device === 0 ? classes = ['appear', 'disappear']: classes = ['appear-mobile-sidebar', 'disappear-mobile-sidebar'];
    switch(toggle) {
        case 'off':
            sidebar.classList.add(classes[1]);
            sidebar.classList.remove(classes[0]);
            break;
        case 'on':
            sidebar.classList.add(classes[0]);
            sidebar.classList.remove(classes[1]);
            break;
        default:
            throw new Error(`Invalid toggle parameter: ${toggle}`); }
}

function seatUpdate(seatClasses, seat) {
    if(seatClasses.includes('available')) {
        seat.setAttribute('class', 'seat selected');
        selectedSeats += 1;
        return; }
    if(seatClasses.includes('selected')) {
        seat.setAttribute('class', 'seat available');
        selectedSeats -= 1;
        return; }
}

function summary(seatNumberSpan, totalSpan) {
    total = selectedSeats * ticketPrice;
    seatNumberSpan.textContent = selectedSeats.toString();
    totalSpan.textContent = `${total.toFixed(2)}€`;
}

function seatSelected(device) {
    return event => {
        const seatClasses = event.target.getAttribute('class');
        let sidebar, sidebarOpacityStyle, seatNumberSpan, totalSpan;
        //Desktop behavior
        sidebar = Array.from(document.querySelectorAll('.sidebar')).pop();
        sidebarOpacityStyle = window.getComputedStyle(sidebar).opacity;
        seatNumberSpan = Array.from(document.querySelectorAll('.number')).pop();
        totalSpan = Array.from(document.querySelectorAll('.total')).pop();
        if(device === 1) { //Mobile behavior
            const mobileMenu = document.querySelector('.mobile-menu.appear-menu').getAttribute('id');
            sidebar = document.querySelector(`#${mobileMenu} > .sidebar`);
            sidebarOpacityStyle = window.getComputedStyle(sidebar).opacity;
            seatNumberSpan = document.querySelector(`#${mobileMenu} .number`);
            totalSpan = document.querySelector(`#${mobileMenu} .total`); }
        seatUpdate(seatClasses, event.target);
        if(selectedSeats == 0) { displaySidebar(sidebar, device, 'off'); }
        if(selectedSeats > 0 && sidebarOpacityStyle == 0) { displaySidebar(sidebar, device, 'on'); }
        summary(seatNumberSpan, totalSpan); }
}

//Desktop behavior
const availableSeats = document.querySelectorAll('.row .seat.available');
availableSeats.forEach(seat => { seat.addEventListener('click', seatSelected(0)); });

//Mobile behavior
if((window.innerWidth <= 1900 && window.innerHeight <= 1000) || (window.innerWidth <= 1000 && window.innerHeight <= 1900)) {

    //Functions
    function displayMenu(menu, toggle) {
        switch(toggle) {
            case 'on':
                menu.classList.add('appear-menu');
                menu.classList.remove('disappear-menu');
                break;
            case 'off':
                menu.classList.add('disappear-menu');
                menu.classList.remove('appear-menu');
                break;
            default:
                throw new Error(`Invalid toggle parameter: ${toggle}`); }
    }

    function backToAvailable(seat) {
        seat.classList.remove('selected');
        seat.classList.add('available'); }

    function hideMainMenu(menu) {
        menu.classList.add('disappear-main-menu');
        menu.classList.remove('appear-main-menu'); }

    function showMainMenu() {
        const overlay = document.querySelector('.overlay');
        const menuItems = document.querySelector('nav > ul:last-child');
        menuItems.classList.add('appear-main-menu');
        menuItems.classList.remove('disappear-main-menu');
        overlay.classList.add('show-overlay'); }

    //Menu
    const menuItems = document.querySelector('nav > ul:last-child');
    menuItems.classList.remove('flex-start-center');
    const menuButton = document.querySelector('.menu-button');
    menuButton.addEventListener('click', showMainMenu);

    //First view
    const isles = document.querySelectorAll('.isle');
    const labels = ['1R/left', '1R/central', '1R/right',
                    '2R/left', '2R/central', '2R/right',
                    '3R/left', '3R/central', '3R/right'];
    isles.forEach((element, index) => {element.textContent = labels[index];});

    //Isle-zoomed view
    isles.forEach(element => {
        element.addEventListener('click', () => {
            const overlay = document.querySelector('.overlay');
            const targetId = element.getAttribute('aria-labelledby');
            const menu = document.getElementById(targetId);
            displayMenu(menu, 'on');
            overlay.classList.add('show-overlay');
        });
    });

    //Returning back to the first view
    window.onclick = event => {
        const overlay = document.querySelector('.overlay');
        const mainMenu = document.querySelector('nav > ul:last-child.appear-main-menu');
        const mobileMenu = document.querySelector('.mobile-menu.appear-menu');
        if(event.target.matches('.overlay')) {
            overlay.classList.remove('show-overlay');
            if(mobileMenu) {
                const mobileMenuId = mobileMenu.getAttribute('id');
                const mobileSidebar = document.querySelector(`#${mobileMenuId} > .sidebar`);
                const seats = document.querySelectorAll('.appear-menu mobile-isle > .seat');
                seats.forEach(seat => {
                    const seatClasses = seat.getAttribute('class');
                    seatClasses.includes('selected') ? backToAvailable(seat) : undefined; }
                );
                displaySidebar(mobileSidebar, 1, 'off');
                displayMenu(mobileMenu, 'off');
                selectedSeats = 0; total = 0;
                return; }
            return hideMainMenu(mainMenu); }
    };

    const availableSeatsMobile = document.querySelectorAll('.mobile-isle .seat.available');
    availableSeatsMobile.forEach(seat => { seat.addEventListener('click', seatSelected(1)); });
}