const express = require("express");
const multer = require("multer");
const session = require("express-session");

const config = require("./configuration/config");
const Product = require("./models/products");
const User = require("./models/User");
let ObjectId = require("mongodb").ObjectId; // for casting id to objectId
const PORT = process.env.PORT || 3000;

config();

const upload = multer();
const app = express();

app.use(
    session({
        secret: "something secret",
        resave: false,
        saveUninitialized: true,
        //cookie: { secure: true }
    })
);

app.use(express.json());
app.set("view engine", "ejs");
app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
});
app.use(express.static("public"));

async function getProductDetails(productId){
    let id = new ObjectId(productId);
    let item = await Product.find(id, function (err, result) {
        if (err) {
            console.log('error in finding object by the id');
            res.statusCode = 404;
        }        
    });
    // console.log('inside funct' , item);
    return item;
}

app.get("/", async function (req, res) {
    if(req.session.toCart && req.session.isLoggedIn){
        req.session.toCart = false;
        res.redirect('/cart')
        return;
    }
    let userInfo = {
        isLoggedIn: req.session.isLoggedIn,
        userName: req.session.userName,
    };
    console.log('loggedin' , req.session.isLoggedIn) ;
    // await Product.update({product:'keyboard'}, {path: 'images/hp-keyboard.png', description:'this is keyboard'}, {multi : true})

    await Product.find(function (err, items) {   
        if(err){
            console.log('error in finding the product for homepage');
            return;
        }     
        userInfo.products = items;
    });    

    res.render("index", { userInfo });
});

// get all the products to the homepage;; not getting req  on this path
app.post("/product/add",async function (req, res) {
    // use .limit(), .exec() , .skip() mehtods to limit and skip the fetched data
    // and send according to requirement
    let {isLoggedIn, userName} = req.session;

    if(!isLoggedIn){
        res.send({isLoggedIn});
        return;
    }
    // else{    
        let Name = userName;
        console.log(req.body, Name);   
        let {id, quantity}  = req.body;
        
        let user =  await User.findOne( {Name}, function (err, item) {
            if(err)
            console.log('eroor in finding the user for adding the product to cart');
            //console.log(result)
            // res.send(item);
        });

        // if user found update the cart
        if(user){            
            let {Cart}  = user;
            let productFound = false;

            if(Cart){
                Cart.forEach((item) => {
                    if(item.id === id){
                        item.quantity = Number(item.quantity)+Number(quantity);
                        productFound = true;
                        return;
                    }
                })               
            }

            // console.log(user, Cart);
            
            if(!productFound){
                quantity = Number(quantity);
                Cart.push({id,quantity})
            }            

            // update the user data with  the updated Cart 
            await User.updateOne({Name},{Cart}, function(err){
                if(err)
                console.log('error in updating the usercart');
            })

            res.send({status : true, isLoggedIn})
            return;
        }

        res.send({status:false,isLoggedIn})
    // }

});

// send the detail of a particular product
app.get("/detail", function (req, res) {    
    let userInfo = {
        isLoggedIn: req.session.isLoggedIn,
        userName: req.session.userName,
    };
    res.render("proDescription", { userInfo });
});

app.post("/detail", function (req, res) {

    console.log(req.body);

    req.body.id = JSON.parse(req.body.id); // still a string only quotes removed
    // console.log(req.body.id, typeof req.body.id);

    if (req.body.id === null) {
        res.statusCode = 404;
    }

    // find object by objectId    --> make it as seperate function
    let id = new ObjectId(req.body.id);
    Product.find(id, function (err, result) {
        if (err) {
            console.log('error in finding object by the id');
            res.statusCode = 404;
        }
        res.send(result);
    });
});

// view login page
app.get("/login", function (req, res) {
    let info ={};
    info.status = 'Plese Login';
    if (req.session.isSignedUp) {
        req.session.isSignedUp = false;
        info.status = false;
        res.render("login", { info });
    } 
    else res.render("login", { info });
});

// login user
app.post("/login", upload.none(), async function (req, res) {
    console.log(req.body);
    let { Email, Password } = req.body;
    console.log(Email, Password);

    let currUser = {
        Email: Email,
        Password: Password,
    };    

    let foundUser = await User.findOne(currUser, function (err, foundUser) {
        if (err) {
            console.log("error while logging in user");
        }
    });
    console.log("found", foundUser);    

    if (foundUser) {
        req.session.userEmail = Email;
        req.session.userName = foundUser.Name;
        req.session.isLoggedIn = true;
        res.redirect("/");
    } 
    else {
        let info = {};        
        info.status =
            "No User found with provided credentials ! please try again ";        
        res.render("login", { info });
    }

});

// view signup page
app.get("/signup", function (req, res) {
    let info;
    res.render("signup", { info });
});

// signup user
app.post("/signup", upload.none(), async function (req, res) {
    //req.body = JSON.parse(req.body);
    let info = {};    
    let { Email } = req.body;    

    let foundUser = await User.find({ Email }, function (err, user) {
        if (err)
            console.log(
                "error in finding other user with recieved details while signing up"
            );
    });
    console.log("OUTSIDE", foundUser);

    if (foundUser.length > 0) {
        info.status = "User with the same Email already exist ";
        res.render("signup", { info });
    }
    else {
        let newUser = new User(req.body);

        await newUser.save((err, user) => {
            if (err) {
                console.log("error in saving the new user");
                info.status = "Some error occured ! please try again";
                res.render("signup", { info });
            } else {
                console.log(user);
                res.redirect("/login");
            }
        });

    }
    
});

// logic pending 
app.get("/cart",async function (req, res) {

    let {isLoggedIn, userEmail} = req.session;

    if(!isLoggedIn){
        req.session.toCart = true;
        res.redirect('/login');        
        return;
    }

    let cartInfo = {} ;
    let Email = userEmail;
    let findUser = await User.findOne({Email}, function(err,userDetail){
        if(err){
            console.log('errror in finding the current user for the cart');
        }        
    })

    // console.log(findUser)

    if(findUser){        
        
        // cartInfo.cartProducts = findUser.Cart;
        cartInfo.userName = req.session.userName;
        // console.log(cartInfo)

        // find the details of the proudcts

        let {Cart} = findUser;
        // console.log('cart for specific user', Cart);
        let productDetails = [];

       for(let i = 0; i < Cart.length; i++){
        let itemObj  = await getProductDetails(Cart[i].id);
        itemObj[0].quantity = Cart[i].quantity;

            // console.log(itemObj)        // itemObj  is an array of single object     [ [Object] ]
            // let item = {path,product,price};
            productDetails.push(itemObj);       // so, its an array having array of object  [ [ [Object] ], [ [Object] ] ] 
       }
       
       //send the productDetails to the client side and paste the details to the page

        // console.log(productDetails);
        // productDetails.forEach(item => {
        //     console.log(item);
        // })


        cartInfo.cartProducts = productDetails;
        console.log(cartInfo);

        res.render("Cart/cart", {cartInfo});
    }
    else{
        let info = {};
        info.status = 'cart Not found';
        res.redirect('/');
    }    
    req.session.toCart = false;
});

app.get('/logout', function(req,res){
    req.session.destroy();
    res.redirect("/");
})



app.listen(PORT, () => {
    console.log("server is listening at http://localhost:" + PORT);
});
