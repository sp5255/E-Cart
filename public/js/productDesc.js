let name = document.getElementById("p_name");
let desc = document.getElementById("p_desc");
let productPrice = document.getElementById("p_price");
let image = document.getElementById("p__img");

let addToCartBtn = document.getElementsByName('add to cart btn')[0];

// general function for send AJAX
function sendReq(method, path, dataOb) {
    let req = new XMLHttpRequest();
    req.open(method.toUpperCase(), path);
    if (method.toUpperCase() === "POST") {
        req.setRequestHeader("Content-type", "application/json");        
        req.send(dataOb);
    } else {
        req.send();
    }
    return req;
}

let ob = {
    id: localStorage.getItem("id"), // id of clikced product
};

ob = JSON.stringify(ob);

// get the detail of the product and show on page

let productDetail = sendReq("post", "/detail", ob);

productDetail.addEventListener("load", function () {
    console.log(productDetail.responseText);
    productDetail = JSON.parse(productDetail.responseText);    
    console.log(productDetail);

    let {product, description, price, path, _id} = productDetail[0];

    name.innerText = product;
    desc.innerText = description;
    productPrice.innerText = price;
    image.src = path;    
    addToCartBtn.id = _id;
    // console.log(_id);

});

let plus = document.getElementById("plus");
let minus = document.getElementById("minus");
let quantity = document.getElementById("quantity");

function increase(plus) {    
    if (plus === true) {
        if (Number(quantity.innerText) >= 10)
            alert("max products to be added at onec reaches to limit");
        else quantity.innerText = Number(quantity.innerText) + 1;
    } else {
        if (Number(quantity.innerText) > 1)
            quantity.innerText = Number(quantity.innerText) - 1;
    }
}

plus.addEventListener("click", function () {
    increase(true);
});
minus.addEventListener("click", function () {
    increase(false);
});

addToCartBtn.addEventListener('click',  function(){
    
    if(!this.id){
        alert("please wait page to load");
        return;
    }
    else{        
        let obj = {
            id:this.id,
            quantity:quantity.innerText,
        }
        obj = JSON.stringify(obj);
       let Status =  sendReq("post","/product/add", obj);     
       Status.addEventListener('load', function(){
           Status = JSON.parse(Status.responseText);
           console.log(Status)
        if(!Status.isLoggedIn){
            alert('you have to login first');
            location.href = '/login';
            return;
        }
        if(Status.status){
            alert('item added successfull ')
        }
        else{
            alert('some error occurred');
        }
    })
  
    }
})
