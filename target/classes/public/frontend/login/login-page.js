/**
 * This script handles the login functionality for the Recipe Management Application.
 * It manages user authentication by sending login requests to the server and handling responses.
*/
const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * Get references to DOM elements
 * - username input
 * - password input
 * - login button
 * - logout button (optional, for token testing)
 */
const usernameInput = document.getElementById("login-input");
const passwordInput = document.getElementById("password-input");
const loginButtonInput = document.getElementById("login-button");
const logoutButtonInput = document.getElementById("logout-button");

/* 
 * click event listener to login button
 * - Call processLogin on click
 */
loginButton.onclick = processLogin;

/**
 * Process Login Function
 * 
 * Requirements:
 * - Retrieve values from username and password input fields
 * - Construct a request body with { username, password }
 * - Configure request options for fetch (POST, JSON headers)
 * - Send request to /login endpoint
 * - Handle responses:
 *    - If 200: extract token and isAdmin from response text
 *      - Store both in sessionStorage
 *      - Redirect to recipe-page.html
 *    - If 401: alert user about incorrect login
 *    - For others: show generic alert
 * - Add try/catch to handle fetch/network errors
 * 
 * Hints:
 * - Use fetch with POST method and JSON body
 * - Use sessionStorage.setItem("key", value) to store auth token and admin flag
 * - Use `window.location.href` for redirection
 */
async function processLogin() {

    // Retrieve username and password from input fields
    // - Trim input and validate that neither is empty
    const username = usernameInput.value.trim();
    const password = usernameInput.value.trim();

        if (!username) {
            console.log("Username empty.");
            alert("Please enter a username.");
            return;
        }


        if (!password) {
            console.log("Password empty.");
            alert("Please enter a password.");
            return;
        }

    // requestBody object with username and password
    const requestBody = { username, password };

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
        body: JSON.stringify(requestBody)
    };

    try {
        // Send POST request to http://localhost:8081/login using fetch with requestOptions
        const postResponse = await fetch(`http://localhost:8081/login`, requestOptions);

        // If response status is 200
        if ( postResponse.status == 200 ) {

            // - Read the response as text
            const responseText = await postResponse.text();

            // - Response will be a space-separated string: "token123 true"
            // - Split the string into token and isAdmin flag
            const [token, isAdmin] = responseText.split(' ');

            // - Store both in sessionStorage using sessionStorage.setItem()
            sessionStorage.setItem('token', token);
            sessionStorage.setItem('isAdmin', isAdmin);
            
            // Optionally show the logout button if applicable
            logoutButtonInput.hidden = false;

            // Add a small delay (e.g., 500ms) using setTimeout before redirecting
            // - Use window.location.href to redirect to the recipe page
            setTimeout(() => {
                window.location.href = '/recipes.html'; 
            }, 500);
            return;
            
        }

        // If response status is 401
        if ( postResponse.status == 401 ) {

        // - Alert the user with "Incorrect login!"
            console.log("Incorrect login.");
            alert("Incorrect login!");
            return;
        }
        // For any other status code
        // - Alert the user with a generic error like "Unknown issue!"
        console.log("Non 200 or 401 status from POST.");
        alert("Unknown issue!");
        return;

    } catch (error) {
        // Handle any network or unexpected errors
        // - Log the error and alert the user
        console.log(error);
        alert("Uh-oh, an error occurred!");
    }
}

