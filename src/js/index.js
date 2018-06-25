import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as SearchView from './views/SearchView';
import * as RecipeView from './views/RecipeView';
import * as ListView from './views/ListView';
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
        RecipeView.renderRecipe(state.recipe);
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