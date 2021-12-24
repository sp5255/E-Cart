let navLogin = document.getElementById("nav__login");
if(navLogin)
navLogin.addEventListener("click", function () {
    location.href = "/login";
});

let navHomeHeading = document.getElementById("nav__h");

navHomeHeading.addEventListener("click", function () {
    location.href = "/";
});

let cartIcon = document.getElementById('cart-icon');
// console.log(cartIcon)
if(cartIcon)
cartIcon.addEventListener('click', function(){
    console.log('cart clikc');
    location.href = '/cart';
})

let logout = document.getElementById('logout');
if(logout   )
logout.addEventListener('click', function(){
    console.log('logout clikc');
    location.href = '/logout';
})