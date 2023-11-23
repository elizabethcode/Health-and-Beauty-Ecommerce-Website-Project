// shopping cart

//initalizing firebase
const firebaseConfig = {
    apiKey: "AIzaSyDRxXLWHei5LTGIr_-6eCaL_owAgz_QkOE",
    authDomain: "ecommercewebsiteproject-5f283.firebaseapp.com",
    databaseURL: "https://ecommercewebsiteproject-5f283-default-rtdb.firebaseio.com",
    projectId: "ecommercewebsiteproject-5f283",
    storageBucket: "ecommercewebsiteproject-5f283.appspot.com",
    messagingSenderId: "527330989842",
    appId: "1:527330989842:web:d7df7f447a3ad56e1145cb"
};
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

//empty shopping basket arary - able to put items in the array 
let shoppingBasket = [];

//add items ot the basket
function addToBasket(product) {
    shoppingBasket.push(product);
    updateCart();
}

//removing item from the basket
function removeItem(index) {
    shoppingBasket.splice(index, 1);
    updateCart();
}

//updating cart - when adding items to basket it will retrieve the name and price of the product
function updateCart() {
    //listening to the shopping cart items and the shopping total
    const cartItems = document.getElementById('shoppingBasketItems');
    const cartTotal = document.getElementById('shoppingBasketTotal');
    //start with shopping total of 0
    let total = 0;
    cartItems.innerHTML = '';
    //for each items addedd to the basket make it in a format of a list
    //create a remove button for each item listed
    //when "remove" button is clicked it will remove item from the list
    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = item;
        const removeItemButton = document.createElement('button');
        removeItemButton.innerText = 'Remove';
        removeItemButton.onclick = () => removeItem(index);
        removeItemButton.className = 'removeButton';
        listItem.appendChild(removeItemButton);
        cartItems.appendChild(listItem);
    });
    cartTotal.innerText = total;
    //save to cart fucntion
    saveCart();
}

//saving cart items and price to database
function saveCart() {
    database.ref('shoppingBasket').set(shoppingBasket);
}

// Listen for changes to the cart in the database
database.ref('shoppingBasket').on('value', (snapshot) => {
    shoppingBasket = snapshot.val() || [];
    updateCart();
});

//go to pay page when clicked on checkout
function checkout() {
    window.location.href = "PayPage.html";
}

//grabbing values of each items and putting it to the database
function addToBasket(name, price) {
    // get a reference to the cart in Firebase
    var cartRef = firebase.database().ref('shoppingBasket');

    // add the item to the cart in Firebase
    cartRef.push({
        name: name,
        price: price
    });

    //alert message will appear with the name of the item and message
    alert(name + " has been added to shopping basket");
}

// get a reference to the cart in Firebase
var cartRef = firebase.database().ref('shoppingBasket');

// retrieve the cart data from Firebase
cartRef.on('value', function (snapshot) {
    // clear the cart items list
    var cartItems = document.getElementById('shoppingBasketItems');
    cartItems.innerHTML = '';

    // calculate the total price
    var total = 0;

    // loop through each item in the cart
    snapshot.forEach(function (childSnapshot) {
        var childData = childSnapshot.val();

        // create a new list item for the cart item
        var listItem = document.createElement('li');
        listItem.innerHTML = childData.name + ' - £' + childData.price;
        // create a remove button for the cart item
        var button = document.createElement('button');
        button.innerHTML = 'Remove';
        button.addEventListener('click', function () {
            // remove the item from the cart in Firebase
            childSnapshot.ref.remove();
        });
        listItem.appendChild(button);

        cartItems.appendChild(listItem);

        // add the price of the item to the total
        total += parseFloat(childData.price);
    });

    // display the total price
    var cartTotal = document.getElementById('shoppingBasketTotal');
    cartTotal.innerHTML = total;
});

// get price from session storage
var price = sessionStorage.getItem("shoppingBasketTotal");
// display price on page
var priceElement = document.getElementById("shoppingBasketTotal");
priceElement.innerHTML = price;

// handle form submission
var form = document.querySelector('form');
form.addEventListener('submit', function (e) {
    e.preventDefault(); // prevent default form submission
    var cardnumber = form.cardnumber.value;
    var expiration = form.expiration.value;
    var cvv = form.cvv.value;

    // validate credit card number
    // For it to be the card number has to start with 42 and it has to be 16 number long
    var cardRegex = /^([0-9]{4}\s){3}[0-9]{4}|[0-9]{16}$/;
    if (!cardRegex.test(cardnumber)) {
        alert('Please enter a valid credit card number');
        return;
    }

    // get current date
    var now = new Date();
    // getMonth() returns 0-11, so add 1 to get 1-12
    var currentMonth = now.getMonth() + 1; 
    // getFullYear() returns the full year, so get last two digits only
    var currentYear = now.getFullYear() % 100; 

    // validate expiration date - if the data is older than the current data then alert message will appear
    var expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expiryDateRegex.test(expiration)) {
        alert('Please enter a valid expiration date (MM/YY)');
        return;
    }
    var expMonth = parseInt(expiration.substring(0, 2));
    var expYear = parseInt(expiration.substring(3));
    if (expYear < currentYear || (expYear == currentYear && expMonth < currentMonth)) {
        alert('Your credit card has expired');
        return;
    }

    // validate CVV - the CVV has to be 3 or 4 numbers
    var cvvRegex = /^[0-9]{3,4}$/;
    if (!cvvRegex.test(cvv)) {
        alert('Please enter a valid CVV');
        return;
    }

    //grabbing all of the data
    var data = {
        name: form.name.value,
        cardnumber: cardnumber,
        expiration: expiration,
        cvv: cvv,
        price: price
    };

    // send data to Firebase Realtime Database
    //put all of the data under the "Orders" heading in the database 
    var database = firebase.database();
    var ordersRef = database.ref('Orders');
    ordersRef.push(data);

    // clear shopping cart
    sessionStorage.removeItem('shoppingBasketTotal');

    // redirect to Success
    window.location.href = 'Success.html';

});