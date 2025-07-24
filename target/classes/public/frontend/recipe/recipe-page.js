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

    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
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
    if (sessionStorage.getItem('auth-token')) {
        logoutButtonInput.hidden = false;
    }

    /*
     * Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem('is-admin') == "true") {
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
            referrerPolicy: "no-referrer"
        };
        try {
            const response = await fetch(`${BASE_URL}/recipes?term=${searchTerm}`, requestOptions);

            if (response.ok) {
                const recipiesToShow = await response.json();
                refreshRecipeList(recipiesToShow);
                return;
            }

            console.log("Non 2xx status from GET in searchRecipes().");
            alert("Uh-oh, an error occurred!");
            return;

        } catch (error) {
            console.log(error);
            alert("Uh-oh, an error occurred!");
        }
    }

    /**
     * Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        const addRecipeName = addRecipeNameInput.value;
        const addRecipeInstructions = addRecipeInstructionsInput.value;

        if (!addRecipeName) {
            console.log("Recipe name empty.");
            alert("Please enter a recipe name.");
            return;
        }

        if (!addRecipeInstructions) {
            console.log("Recipe instructions empty.");
            alert("Please enter recipe instructions.");
            return;
        }
        const requestBody = { "name": addRecipeName, "instructions": addRecipeInstructions };
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
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions);
            if (response.ok) {
                // Clear inputs
                addRecipeNameInput.value = '';
                addRecipeInstructionsInput.value = '';

                // Fetch latest and refresh list
                getRecipes();
                return;
            }

            // 401 means chef auth failed
            else if (response.status == 401) {
                console.log("Chef authentication failed.");
                alert("Chef failed to authenticate.");
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
     * Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        const updateRecipeName = updateRecipeNameInput.value;
        const updateRecipeInstructions = updateRecipeInstructionsInput.value;
        if (!updateRecipeName) {
            console.log("Recipe name empty.");
            alert("Please enter a recipe name.");
            return;
        }

        if (!updateRecipeInstructions) {
            console.log("Recipe instructions empty.");
            alert("Please enter recipe instructions.");
            return;
        }
        const requestBody = { "name": updateRecipeName, "instructions": updateRecipeInstructions };
        const getRequest = {
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
        const putRequest = {
            method: "PUT",
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
            const getResponse = await fetch(`${BASE_URL}/recipes?name=${updateRecipeName}`, getRequest);
            if (getResponse.ok) {
                const jsonResponse = await getResponse.json();
                const recipeID = jsonResponse[0].id;
                 
                const putResponse = await fetch(`${BASE_URL}/recipes/${recipeID}`, putRequest);
                if (putResponse.ok) {
                    // Clear inputs
                    updateRecipeNameInput.value = '';
                    updateRecipeInstructionsInput.value = '';

                    // Get and refresh recipes
                    getRecipes();
                    return;
                } else if (putResponse.status == 404) {
                    console.log("Error fetching recipe ID.");
                    alert("Error fetching recipe ID.");
                    return;
                }
                console.log(`Unexpected status: ${response.status}`);
                alert(`Uh-oh, an error occurred: ${response.status}`);
                return;
            }

            else if (getResponse.status == 404) {
                console.log(`No recipes with name ${updateRecipeName} found.`);
                alert(`No recipes with name ${updateRecipeName} found.`);
                return;
            }
            console.log(`Unexpected status: ${response.status}`);
            alert(`Uh-oh, an error occurred: ${response.status}`);
            return;
        } catch (error) {
            console.log(error);
            alert("Uh-oh, an error occurred!");
            return;
        }


    }

    /**
     * Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        /*
        if (!sesstionStorage.getItem('is-admin')) {
            console.log("Non-admin tried to delete recipe!");
            alert("You need to be an admin to do this!");
            return;
        }*/

        const deleteRecipeName = deleteRecipeNameInput.value;
        const requestBody = { deleteRecipeName };
        const getRequest = {
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
        const delRequest = {
            method: "DELETE",
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
            const getResponse = await fetch(`${BASE_URL}/recipes?name=${deleteRecipeName}`, getRequest);
            if (getResponse.ok) {
                const responseData = await getResponse.json();
                
                const recipeID = responseData[0].id;

                const delResponse = await fetch(`${BASE_URL}/recipes/${recipeID}`, delRequest);
                if (delResponse.ok) {
                    // Clear inputs
                    deleteRecipeName.value = '';

                    // Get and refresh recipes
                    getRecipes();
                    return;

                } else if (putResponse.status == 404) {
                    console.log("Error fetching recipe ID.");
                    alert("Error fetching recipe ID.");
                    return;
                }
            }

            else if (getResponse.status == 404) {
                console.log(`No recipes with name ${updateRecipeName} found.`);
                alert(`No recipes with name ${updateRecipeName} found.`);
                return;
            }
            console.log(`Unexpected status.`);
            alert("Uh-oh, an error occurred: Unexpected status.");
            return;
        } catch (error) {
            console.log(error);
            alert(`Uh-oh, an error occurred!: ${error}`);
            return;
        }
    }

    /**
     * Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
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
            const response = await fetch(`${BASE_URL}/recipes`, requestOptions)
            if (response.ok) {
                const recipes = await response.json();
                refreshRecipeList(recipes);
                return;
            }
            else if (response.status == 404) {
                console.log("No recipes found.");
                alert("No recipes found.");
                return;
            }
            console.log("Non 200 or 404 status from GET in getRecipes().");
            alert("Uh-oh, an error occurred!");
            return;
        } catch (error) {
            console.log(error);
            alert("Uh-oh, an error occurred!");
        }
    }

    /**
     * Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList(recipiesToShow) {
        recipeListInput.innerHTML = '';
        for (var i = 0; i < recipiesToShow.length; i++) {
            var recipe = recipiesToShow[i];
            var listElement = document.createElement('li');
            listElement.innerHTML = `<p>${recipe.name}: ${recipe.instructions}</p>`
            recipeListInput.appendChild(listElement);
        }
    }

    /**
     * Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
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
            referrerPolicy: "no-referrer"
        };
        try {
            const response = await fetch(`${BASE_URL}/logout`, requestOptions);
            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
                return;
            }
            console.log("Couldn't log out.");
            alert("Couldn't log out. Try again.");
            return;
        } catch (error) {
            console.log(error);
            alert("Uh-oh, an error occurred!");
        }
    }

});
