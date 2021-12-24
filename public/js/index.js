let p__container = document.getElementById("p__container");
let items = document.querySelectorAll(".product-img");
let p_title = document.querySelectorAll(".p-title");
let view_description = document.querySelectorAll(".desc-btn");

// sending the id of clicked product to the server and getting the details of that product

view_description.forEach((button, index) => {
    button.addEventListener("click", () => {
        localStorage.setItem(
            "id",
            JSON.stringify(button.parentNode.childNodes[1].id)
        );
        //console.log(button.parentNode.childNodes[1].id)
        window.open("/detail", "new");
        //location.href = '/detail';
    });
});
