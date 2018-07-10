import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as SearchView from './views/searchView';
import * as RecipeView from './views/recipeView';
import * as ListView from './views/listView';
import * as LikesView from './views/likesView';
import { elements, renderLoader, elementsString, cleanLoader } from './views/base';

/** Global state of the app
 * - Search Object
 * - Current Recipe Object
 * - Shopping List Object
 * - Liked Recipes
 */
const state = {};
window.state = state;

/**
 * SEARCH CONTROLLER        
 */

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllerSearch()
});

elements.searchRes.addEventListener('click', e => {
    // 1) Click any inside the button, will always get the .btn
    const btn = e.target.closest('.btn-inline');

    if(!btn) return

    let goToPage = parseInt(btn.dataset.goto, 10);

    SearchView.cleanList();
    SearchView.cleanResPage();

    SearchView.renderResults(state.search.result, goToPage);
})

const controllerSearch = async () => {
    // 1) Get the user input
    const query = SearchView.getUserInput();

    // 2) State the query to SEARCH obj
    state.search = new Search(query);

    // 3) update de UI
    SearchView.cleanField();
    SearchView.cleanList();
    renderLoader(elements.searchRes);

    try{
        // 4) Make the request
        await state.search.getResults();

        // 5) Show the result
        cleanLoader();
        SearchView.renderResults(state.search.result);
    } catch (err){
        alert('Something went wrong with the Search...');
        cleanLoader();
    }
}

/**
 * RECIPE CONTROLLER        
 */

const controllerRecipe = async () => {
    // Get the hash from the url
    const id = window.location.hash.replace('#', '');
    if(!id) return;

    // Saving the recipe in the data state
    state.recipe = new Recipe(id);

    // Highlighting the selected recipe
    if(state.search) SearchView.highlightSelected(id);

    RecipeView.cleanRecipe();
    renderLoader(elements.recipe);

    try{
        // Making the request to get the recipe
        await state.recipe.getRecipe();
        state.recipe.parseIng();
        // Calc methods
        state.recipe.calcTime();
        state.recipe.calcServings();
        cleanLoader();
        // Render the recipe on the view
        RecipeView.renderRecipe(
            state.recipe, 
            state.likes.isLiked(id)
        );
    } catch(err) {
        console.log(err);
        cleanLoader();
        const message = `
            <figure class="recipe__fig">
            <img src="img/404.PNG" alt="Error" class="recipe__img">
                <h1 class="recipe__title">
                    <span>Something went wrong while processing the recipe ):</span>
                </h1>
            </figure>`;
        elements.recipe.insertAdjacentHTML('afterbegin', message)
    }
 }

 /**
 * LIST CONTROLLER        
 */

 const controllerList = () => {
    if(!state.list) state.list = new List();

    state.recipe.ingredients.forEach(el => {
        state.list.addItem(el.count, el.unit, el.ingredient)
    });

    state.list.items.forEach(el => {
        ListView.renderItem(el);
    });
 }

 /**
 * LIKE CONTROLLER        
 */
 const controllerLike = () => {
    //if(!state.likes) 
    const currentID = state.recipe.id

    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike (
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.image
        );
        // Toggle the like button
        LikesView.toggleLikeBtn(true)
        // Add like to the UI list
        LikesView.renderLike(newLike);
    // User has yet liked current recipe
    } else {
        // Remove like to the state
        state.likes.deleteLike(currentID);
        // Toggle the like button
        LikesView.toggleLikeBtn(false)
        // Remove like to the UI list
        LikesView.deleteLike(currentID);
    }

    LikesView.toggleLikeMenu(state.likes.getNumLikes())
 }

 // EVENTS

 ['load','hashchange'].forEach(event => window.addEventListener(event, controllerRecipe));

 // Making the DOM Manipulation
 elements.recipe.addEventListener('click', e => {
     
     if (e.target.matches('.btn-decrease, .btn-decrease *')) {
         // Decrease the count and the servings
         if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            RecipeView.updateCountIng(state.recipe);
         }
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        // increase the count and the servings
        state.recipe.updateServings('inc');
        RecipeView.updateCountIng(state.recipe);
    } else if (e.target.matches('.recipe_btn--add, .recipe_btn--add *')) {
        controllerList();
    }  else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controllerLike()    
    }
 })

 elements.shoppingList.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        state.list.deleteItem(id);
        ListView.deleteItem(id);
    } else if (e.target.matches('.shopping__count--value')) {
        const value = parseFloat(e.target.value);
        state.list.updateItem(id, value);
    }
 })

 // Restore likes recipes on page load

 window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore Likes 
    state.likes.readStorage()

    // Toggle Btn
    LikesView.toggleLikeMenu(state.likes.getNumLikes())   

    // Render the existing likes
    state.likes.likes.forEach(like => LikesView.renderLike(like))
 })

  


