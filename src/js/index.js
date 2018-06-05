import Search from './models/Search';
import Recipe from './models/Recipe';
import * as SearchView from './views/SearchView';
import { elements, renderLoader, elementsString, cleanLoader } from './views/base';

/** Global state of the app
 * - Search Object
 * - Current Recipe Object
 * - Shopping List Object
 * - Liked Recipes
 */
const state = {};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllerSearch()
});

/**
 * SEARCH CONTROLLER        
 */

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

    try{
        // Making the request to get the recipe
        await state.recipe.getRecipe();

        // Calc methods
        state.recipe.calcTime();
        state.recipe.calcServings();

        console.log(state.recipe);
    } catch(err) {
        alert('Something went wrong with the recipe processing... ):');
    }
 }

 ['load','hashchange'].forEach(event => window.addEventListener(event, controllerRecipe));