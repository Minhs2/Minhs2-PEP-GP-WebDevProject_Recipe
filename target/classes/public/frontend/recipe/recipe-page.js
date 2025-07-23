/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const adminLinkInput = document.getElementById("admin-link");
    const logoutButtonInput = document.getElementById("logout-button");

    const searchInput = document.getElementById("search-input");
    const searchButtonInput = document.getElementById("search-button");

    const recipeListInput = document.getElementById("recipe-list");

    const addRecipeNameInput = document.getElementById("add-recipe-name-input" );
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const addRecipeSubmitInput = document.getElementById("add-recipe-submit-input");

    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const updateRecipeSubmitInput = document.getElementById("update-recipe-submit-input");

    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const deleteRecipeSubmitInput = document.getElementById("delete-recipe-submit-input");

    /*
     * Show logout button if auth-token exists in sessionStorage
     */
    if (sesstionStorage.getItem('token')) {
        logoutButtonInput.hidden = false;
    }

    /*
     * Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sesstionStorage.getItem('isAdmin')) {
        adminLinkInput.hidden = false;
    }

    /*
     * Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeSubmitInput.onclick = addRecipe;
    updateRecipeSubmitInput.onclick = updateRecipe;
    deleteRecipeSubmitInput.onclick = deleteRecipe;
    searchButtonInput.onclick = searchRecipes;
    logoutButtonInput.onclick = processLogout;

    /*
     * On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        const searchTerm = searchInput.value;
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
            referrerPolicy: "no-referrer",
        }; 
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${searchTerm}`, requestOptions);
            
        } catch (error) {
            // Handle any network or unexpected errors
            // - Log the error and alert the user
            console.log(error);
            alert("Uh-oh, an error occurred!");
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
    }

    /**
     * Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
    }

});
