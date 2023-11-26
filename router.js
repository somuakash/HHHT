const express = require("express");
let EndPoints = require("../EndPoints/EndPoints")
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const GamerModel = require("../model/gamer");
const SellerModel = require("../model/seller");
const ProductModel = require("../model/product");

const app = express();
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));

/////CORS
const cors = require("cors");
const e = require("express");
const gamer = require("../model/gamer");
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // For legacy browser support
    methods: "*",
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/game-rental", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", (_) => {
    console.log("Database connected:", "mongodb://localhost:27017/game-rental");
});
db.on("error", (err) => {
    console.error("connection error:", err);
});

const gamerCollection = db.collection("gamers");
const sellerCollection = db.collection("sellers");
const productCollection = db.collection("products");

//Default Data

gamerCollection.countDocuments(function (err, count) {
    if (count === 0) {
        gamerCollection.insertMany([{
            _id: "12345",
            email: "cgreig0@friendfeed.com",
            username: "cgreig",
            firstName: "Constantina",
            lastName: "Greig",
            contactNumber: "9423797555",
            password: "sample1",
            userType: "Gamer",
            wishlist: [],
            cart: []
        }, {
            _id: "12346",
            email: "apaddle1@stumbleupon.com",
            username: "apaddle",
            firstName: "Adriano",
            lastName: "Paddle",
            contactNumber: "4665883654",
            password: "sample2",
            userType: "Gamer",
            wishlist: [],
            cart: []
        }, {
            _id: "12347",
            email: "glindeboom2@dedecms.com",
            username: "glindeboom",
            firstName: "Gus",
            lastName: "Lindeboom",
            contactNumber: "2535412427",
            password: "sample3",
            userType: "Gamer",
            wishlist: [],
            cart: []
        }])
    }
});

sellerCollection.countDocuments(function (err, count) {
    if (count === 0) {
        sellerCollection.insertMany([{
            _id: "12348",
            email: "rbenford0@edyoda.com",
            username: "rben",
            firstName: "Raimundo",
            lastName: "Benford",
            contactNumber: "6084454758",
            password: "sample4",
            userType: "Seller"
        }, {
            _id: "12349",
            email: "seisikovitsh1@edyoda.com",
            username: "seisi",
            firstName: "Scarlet",
            lastName: "Eisikovitsh",
            contactNumber: "9661971495",
            password: "sample5",
            userType: "Seller"
        }, {
            _id: "12340",
            email: "lpoulsom2@edyoda.com",
            username: "leon",
            firstName: "Leonhard",
            lastName: "Poulsom",
            contactNumber: "3178567125",
            password: "sample6",
            userType: "Seller"
        }])
    }
});

productCollection.countDocuments(function (err, count) {
    if (count === 0) {
        productCollection.insertMany([{
            _id: "12341",
            title: "Call of Duty",
            thumbnailURL: "https://gamerrentals.in/wp-content/uploads/2020/10/51PvGjV6D5L._SL1000_.jpg",
            sellerUsername: "seisi",
            unitsAvailable: 10,
            productType: "game",
            productImages: [],
            rentalPricePerWeek: 200,
            rentalPricePerMonth: 700
        }, {
            _id: "12342",
            title: "Microsoft Xbox",
            thumbnailURL: "https://gamerrentals.in/wp-content/uploads/2020/09/ddb84cea-92b0-4f66-8369-31865df14fe5.jpg",
            sellerUsername: "leon",
            unitsAvailable: 10,
            productType: "console",
            productImages: [],
            rentalPricePerWeek: 300,
            rentalPricePerMonth: 1000
        }, {
            _id: "12343",
            title: "PS4 Dualshock",
            thumbnailURL: "https://gamerrentals.in/wp-content/uploads/2020/09/31BUiVHy6L.jpg",
            sellerUsername: "rben",
            unitsAvailable: 10,
            productType: "controller",
            productImages: [],
            rentalPricePerWeek: 250,
            rentalPricePerMonth: 900
        }])
    }
});


//Register 
app.post(EndPoints.USER, (req, res) => {

    const { username, email, password, firstName, lastName, contactNumber, userType } = req.body

    if (!email) {
        return res.status(400).json({ error: "Please provide email" });
    }
    else if (!username) {
        return res.status(400).json({ error: "Please provide username" });
    }
    else if (!firstName) {
        return res.status(400).json({ error: "Please provide firstName" });
    }
    else if (!lastName) {
        return res.status(400).json({ error: "Please provide lastName" });
    }
    else if (!contactNumber) {
        return res.status(400).json({ error: "Please provide contactNumber" });
    }
    else if (!password) {
        return res.status(400).json({ error: "Please provide password" });
    }
    else if (!userType) {
        return res.status(400).json({ error: "Please provide userType" });
    }
    else {

        userType == "Gamer"
            ? gamerCollection
                .insertOne(
                    new GamerModel({
                        _id: (new Date().getTime()).toString(),
                        username: username,
                        email: email,
                        password: password,
                        firstName: firstName,
                        lastName: lastName,
                        contactNumber: contactNumber,
                        userType: userType,
                        wishlist: [],
                        cart: []
                    })
                )
                .then((result) => {
                    gamerCollection.findOne({ _id: result.insertedId })
                        .then((response) => {
                            res.send(response)
                        })
                        .catch((err) => {
                            return err;
                        })

                })
                .catch((err) => {
                    res.send(err);
                })
            : email.split("@")[1] == "admin.com"
                ? sellerCollection
                    .insertOne(
                        new SellerModel({
                            _id: (new Date().getTime()).toString(),
                            username: username,
                            email: email,
                            password: password,
                            firstName: firstName,
                            lastName: lastName,
                            contactNumber: contactNumber,
                            userType: userType
                        })
                    )
                    .then((result) => {
                        sellerCollection.findOne({ _id: result.insertedId })
                            .then((response) => {
                                res.send(response)
                            })
                            .catch((err) => {
                                return err;
                            })
                    })
                    .catch((err) => {
                        res.send(err);
                    })
                : res.status(400).json({ error: "Sellers can only register with an email address with the admin domain" });
    }
})

//Login
app.post(EndPoints.LOGIN, (req, res) => {
    const { username, password } = req.body;

    gamerCollection.findOne({ username: username })
        .then((response) => {
            if (response == null) {
                sellerCollection.findOne({ username: username })
                    .then((result) => {
                        if (result == null) {
                            res.status(400).json({ error: "Invalid Login Credentials" });
                        }
                        else {
                            if (result.password == password) {
                                res.send({
                                    userId: result._id,
                                    message: "Login successful"
                                })
                            }
                            else {
                                res.status(400).json({ error: "Invalid Login Credentials" });
                            }
                        }
                    })
            }
            else {
                if (response.password == password) {
                    res.send({
                        userId: response._id,
                        message: "Login successful"
                    })
                }
                else {
                    res.status(400).json({ error: "Invalid Login Credentials" });
                }
            }
        })
})

//View user details
app.get(EndPoints.USER + ":username", (req, res) => {

    const username = req.params.username;

    // ----- Write your code below -----
    gamerCollection.findOne({ username: username })
        .then((gamer) => {
            if (gamer) {
                
                res.status(200).json(gamer);
            } else {
                sellerCollection.findOne({ username: username })
                    .then((seller) => {
                        if (seller) {
                            
                            res.status(200).json(seller);
                        } else {
                            
                            res.status(404).json({ error: "User not found" });
                        }
                    })
                    .catch((err) => {
                        res.status(500).json({ error: err.message });
                    });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
   
})


//Update user details
app.put(EndPoints.USER, (req, res) => {

    const { userID, username, email, password, firstName, lastName, contactNumber, userType } = req.body

    // ----- Write your code below -----
    const updateUser = {
        username,
        email,
        password,
        firstName,
        lastName,
        contactNumber,
        userType,
    };

    if (userType === "Gamer") {
        gamerCollection.findOneAndUpdate({ _id: userID }, { $set: updateUser }, { new: true })
            .then((updatedGamer) => {
                if (updatedGamer) {
                    res.send(updatedGamer);
                } else {
                    res.status(404).json({ error: "Gamer not found" });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    } else {
        sellerCollection.findOneAndUpdate({ _id: userID }, { $set: updateUser }, { new: true })
            .then((updatedSeller) => {
                if (updatedSeller) {
                    res.send(updatedSeller);
                } else {
                    res.status(404).json({ error: "Seller not found" });
                }
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    }

})

//Create product
app.post(EndPoints.PRODUCT, (req, res) => {

    const { title, thumbnailURL, sellerUsername, unitsAvailable, productType, productImages, rentalPricePerWeek, rentalPricePerMonth } = req.body

    // ----- Write your code below -----
    const newProduct = new ProductModel({
        _id: (new Date().getTime()).toString(),
        title,
        thumbnailURL,
        sellerUsername,
        unitsAvailable,
        productType,
        productImages,
        rentalPricePerWeek,
        rentalPricePerMonth,
    });

    productCollection.insertOne(newProduct)
        .then((result) => {
            res.send(result.ops[0]);
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
    

})

//Homepage API
app.get(EndPoints.PRODUCT, (req, res) => {

    // ----- Write your code below -----
    productCollection.find({}).toArray()
    .then((products) => {
        res.send(products);
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });

})

//Product details
app.get(EndPoints.PRODUCT + ":id", (req, res) => {
    const productID = req.params.id;

    // ----- Write your code below -----
    productCollection.findOne({ _id: productID })
        .then((product) => {
            if (product) {
                res.send(product);
            } else {
                res.status(404).json({ error: "Product not found" });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });

})

//Update product
app.put(EndPoints.PRODUCT, (req, res) => {
    const { productID, title, thumbnailURL, sellerUsername, unitsAvailable, productType, productImages, rentalPricePerWeek, rentalPricePerMonth } = req.body

    // ----- Write your code below -----
    const updatedProduct = {
        title,
        thumbnailURL,
        sellerUsername,
        unitsAvailable,
        productType,
        productImages,
        rentalPricePerWeek,
        rentalPricePerMonth,
    };

    productCollection.findOneAndUpdate({ _id: productID }, { $set: updatedProduct }, { new: true })
        .then((updatedProduct) => {
            if (updatedProduct) {
                res.send(updatedProduct);
            } else {
                res.status(404).json({ error: "Product not found" });
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err.message });
        });
})

//save/remove from wishlist
app.put(EndPoints.WISHLIST, (req, res) => {

    const { userID, productID } = req.body;

    // ----- Write your code below -----
    gamerCollection.findOne({ _id: userID })
    .then((user) => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Find the product
        productCollection.findOne({ _id: productID })
            .then((product) => {
                if (!product) {
                    return res.status(404).json({ error: "Product not found" });
                }
                const existingItem = user.wishlist.find(item => item.productID === productID);
                if (existingItem) {
                    return res.status(400).json({ error: "Product is already in the wishlist" });
                }
                user.wishlist.push({
                    productID: product._id,
                    title: product.title,
                });
                gamerCollection.findOneAndUpdate({ _id: userID }, { $set: { wishlist: user.wishlist } }, { new: true })
                    .then(updatedUser => {
                        res.status(200).json(updatedUser.wishlist);
                    })
                    .catch(err => {
                        res.status(500).json({ error: err.message });
                    });
            })
            .catch((err) => {
                res.status(500).json({ error: err.message });
            });
    })
    .catch((err) => {
        res.status(500).json({ error: err.message });
    });
})
    

//add/remove from cart
app.put(EndPoints.CART, (req, res) => {

    const { userID, productID, count, bookingStartDate, bookingEndDate } = req.body

    // ----- Write your code below -----
    const existingProduct = GamerModel.find(item => item.productID === productID);

    if (existingProduct) {
        existingProduct.quantity += quantity;
        res.status(200).json({ message: "Product quantity updated in the cart" });
    } else {
        userCart.push({ userID, productID, productName, quantity });
        res.status(200).json({ message: "Product added to the cart" });
    }

    const index = GamerModel.findIndex(item => item.productID === productID);

    if (index !== -1) {
        userCart.splice(index, 1);
        res.status(200).json({ message: "Product removed from the cart" });
    } else {
        res.status(404).json({ error: "Product not found in the cart" });
    }
})

//place order
app.put(EndPoints.ORDER, (req, res) => {

    const { userID } = req.body

    // ----- Write your code below -----
    app.put(EndPoints.ORDER, (req, res) => {
        const { userID } = req.body;
    
        
        if (cart.length === 0) {
            return res.status(400).json({ error: "Cart is empty. Cannot place an empty order." });
        }
    
        const totalAmount = calculateTotalAmount(cart);
    
        
        const order = {
            orderID: generateOrderID(),
            userID,
            cart,
            totalAmount,
            orderDate: new Date(),
        };
    
        
        userOrders.push(order);
        clearUserCart(userID);
    
        res.status(200).json({ message: "Order placed successfully", order });
    });
})

exports.app = app;
exports.gamerCollection = gamerCollection;
exports.sellerCollection = sellerCollection;
exports.productCollection = productCollection;
