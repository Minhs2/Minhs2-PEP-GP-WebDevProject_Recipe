/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
var usernameInput = document.getElementById("username-input");
var emailInput = document.getElementById("email-input");
var passwordInput = document.getElementById("password-input");
var repeatPasswordInput = document.getElementById("repeat-password-input");
var registerButton = document.getElementById("register-button");

/* 
 * Ensure the register button calls processRegistration when clicked
 */
registerButton.onclick = processRegistration;

/**
 * Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    try {
        // Retrieve username, email, password, and repeat password from input fields
        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const repeatPassword = repeatPasswordInput.value;
        
        // Validate all fields are filled
        // Leverage the fact that null evaluates to falsy
        if (!username) {
            console.log("Username empty.");
            alert("Please enter a username.");
            return;
        }

        if (!email) {
            console.log("Email empty.");
            alert("Please enter an email.");
            return;
        }

        if (!password) {
            console.log("Password empty.");
            alert("Please enter a password.");
            return;
        }

        if (!repeatPassword) {
            console.log("Repeat Password empty.");
            alert("Please repeat your password.");
            return;
        }

        // Check that password and repeat password match
        if (password != repeatPassword) {
            console.log("Password mismatch.");
            alert("Password and repeat password are not the same!");
            return;
        }

        // Create a request body with username, email, and password
        const registerBody = { username, email, password };

        // Define requestOptions using method POST and proper headers
    const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*"
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(registerBody)
        };

        // Send POST request to `${BASE_URL}/register`
        // await for promise
        const postResponse = await fetch(`${BASE_URL}/register`, requestOptions);

        // If status is 201:
        if (postResponse.status == 201) {
            // Redirect user to login page
            window.location.replace("../login/login-page.html");
            return;
        }

        // If status is 409:
        if (postResponse.status == 409) {
            // Alert that user/email already exists
            console.log("Email already exists.");
            alert("Email already exists!");
            return;
        }
        
        // Otherwise: Alert generic registration error
        console.log("Non 201 or 409 status from POST.");
        alert("Uh-oh, an error occurred!");
        return;

    } catch (error) {
        console.log(error);
        alert("Uh-oh, an error occurred!");
    }
}
