/**
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
const addIngredientNameInput = document.getElementById("add-ingredient-name-input");
const deleteIngredientNameInput = document.getElementById("delete-ingredient-name-input");
const ingredientListContainer = document.getElementById("ingredient-list");

const addIngredientButton = document.getElementById("add-ingredient-submit-button");
const deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");

// const adminLink = document.getElementById("back-link");

/* 
 * Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;

/*
 * Create an array to keep track of ingredients
 */
var ingredientArray = [];
/* 
 * On page load, call getIngredients()
 */
getIngredients();

/**
 * Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    addIngredientName = addIngredientNameInput.value.trim();

    if (!addIngredientName) {
        console.log("Ingredient name empty.");
        alert("Please enter ingredient name.");
        return;
    }
    const requestBody = { addIngredientName };
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(requestBody)
    };
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
        if (response.ok) {
            addIngredientNameInput.value = '';
            getIngredients();
            return;
        }
        console.log(`Uh-oh, an error occurred!: ${response.status}`);
        alert(`Uh-oh, an error occurred!: ${response.status}`);
        return;
    } catch (error) {
        console.log(error);
        alert("Uh-oh, an error occurred!");
    }
}


/**
 * Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    const requestOptions = {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
            "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
        },
        redirect: "follow",
        referrerPolicy: "no-referrer"
    };
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, requestOptions);
        if (response.ok) {
            const respJson = response.json();
            for (var i = 0; i < respJson.length; i++){
                
            }
            return;
        }
        console.log(`Uh-oh, an error occurred!: ${response.status}`);
        alert(`Uh-oh, an error occurred!: ${response.status}`);
        return;
    } catch (error) {
        console.log(error);
        alert("Uh-oh, an error occurred!");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
}
