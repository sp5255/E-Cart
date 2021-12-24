let pass1 = document.getElementById("pass1");
let pass2 = document.getElementById("pass2");
let signUp = document.getElementById("signBtn");

signUp.addEventListener("click", function (event) {
    if (pass1.value <= 4) {
        alert("choosen password is too small please choose another password");
        event.preventDefault();
    }

    if (pass1.value != pass2.value) {
        alert("password not matched ! try again");
        pass2.value = "";
        event.preventDefault();
    }
});
