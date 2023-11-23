//Register, signing in and signing out fucntions

// setting up firebase with our website
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDRxXLWHei5LTGIr_-6eCaL_owAgz_QkOE",
    authDomain: "ecommercewebsiteproject-5f283.firebaseapp.com",
    databaseURL: "https://ecommercewebsiteproject-5f283-default-rtdb.firebaseio.com",
    projectId: "ecommercewebsiteproject-5f283",
    storageBucket: "ecommercewebsiteproject-5f283.appspot.com",
    messagingSenderId: "527330989842",
    appId: "1:527330989842:web:d7df7f447a3ad56e1145cb"
});

//creating a reference to cloud firestore - interact with database
const db = firebaseApp.firestore();

//creating a reference to firebase authentication - interact with database
const auth = firebaseApp.auth();

// register function
const Register = () => {
    //get the email and passwrd data
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;

    // Check if the email and password inputs are enpty if so show alrt message
    if (!email || !password) {
        alert("Please enter both your email and password.");
        return;
    }

    // Email validation - has to have "@" otherwise alert message will appear
    if (!email.includes("@")) {
        alert("Please enter a valid email address.");
        return;
    }

    // Password validation - has to fit the criterial otherwise alert message will appear
    if (password.length < 8 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/\d|\W/.test(password)) {
        alert("Please enter a stronger password. Your password should be at least 8 characters long, contain a mix of upper and lowercase letters, and include at least one number and a special character.");
        return;
    }

    //Once email and password valide log it.
    console.log(email, password)

    // authorise email and password 
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
            // Signed in successfully
            alert("You have successfully created an account!");
            // Redirect to the welcome page  
            window.location.href = "SignIn.html";        
        })
        .catch((error) => {
            alert("You are unable to create an this account please try again.");
        });
}

// Sign In function
const signIn = () => {
    //getting user's inputs for email and password
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if email nd password input are empty if so alert message will appear
    if (!email || !password) {
        alert("Please enter both your email and password.");
        return;
    }

    // Email validation - has to have "@" otherwise alert message will appear
    if (!email.includes("@")) {
        alert("Please enter a valid email address.");
        return;
    }

    // firebase code - authorise email and password 
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            // if sign in successfully direct to home page
            window.location.href = "Home.html";
        })
        .catch((error) => {
            //if email or password is incorrect alert message will appear
            if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
                alert("Invalid email or password. Please try again.");
            }
        })
}

// Signing out function
const signOut = () => {
    firebase.auth().signOut()
        .then(() => {
            // if user signs out successfully it will redirect them to the register page
            window.location.href = "Index.html";
        })
        // if user unsuccessfully signs out message will appear 
        .catch((error) => {
            alert("Please try and sign out again");

        })
}








