// const productCards = [ document.querySelectorAll('.forumCards')];
var cards = document.querySelectorAll('.section4 .forumCards');
var nxtBtn = document.querySelectorAll('#nextBtn');
var preBtn = document.querySelectorAll('#preBtn');
// const nxtBtn = [ document.querySelectorAll('.next')];
// const preBtn = [ document.querySelectorAll('.pre')];
cards.forEach( (item , i) => {
    let contDim = item.getBoundingClientRect();
    let contWidth = contDim.width;

    nxtBtn[i].addEventListener( 'click' , () => {
        item.scrollLeft += contWidth;
    })
    preBtn[i].addEventListener( 'click' , () => {
        item.scrollLeft -= contWidth;
    })
})
// productCards.forEach(( i,j) => {
//     let containerDimentions = i.getBoundingClientRect();
//     let containerWidth = containerDimentions.width ;

//     nxtBtn[j].addEventListener('click' , () => {
//         i.scrollLeft += containerWidth;
//     })

//     preBtn[j].addEventListener('click', () => {
//         i.scrollLeft -= containerWidth;
//     })
// })

// bakcground header :

window.addEventListener("scroll", function () {
    var nav = document.querySelector('#navbar');
    nav.classList.toggle("sticky", window.scrollY >150); 
});



