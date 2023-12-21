let toggleS = false;
let selectedSeats = 0;
const ticketPrice = 10.00;
let total = 0;


function toggleSidebar(){
    let menu = document.querySelector('.menu-container');
    
    if(toggleS){menu.style.display = "none"; toggleS = false;}
    else{menu.style.display = "grid"; toggleS = true;}
}

function selectSeats(event){
    if (event.target.classList.contains('seat') && event.target.classList.contains('available')) {
        if (event.target.classList.contains('selected')) {
            event.target.classList.remove('selected');
            selectedSeats -= 1;
            document.querySelector('.selected-seats-popup').innerText = selectedSeats;
            document.querySelector('.total-prices-popup').innerText = selectedSeats * ticketPrice - 0.01 + "€";
        } else {
            event.target.classList.add('selected');
            selectedSeats += 1;
            document.querySelector('.selected-seats-popup').innerText = selectedSeats;
            document.querySelector('.total-prices-popup').innerText = selectedSeats * ticketPrice - 0.01 + "€";
        }
    }

    if(selectedSeats > 0){
        document.querySelector('.purchase-popup').style.transform = "translateX(-320px)";
        document.querySelector('.purchase-popup').style.transition = ".5s";
    } else{
        document.querySelector('.purchase-popup').style.transform = "translateX(20px)";
        document.querySelector('.purchase-popup').style.transition = ".5s";
    }
}


document.body.addEventListener('click', selectSeats);