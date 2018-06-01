import Search from './models/Search';
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

    // 4) Make the request
    await state.search.getResults();

    // 5) Show the result
    cleanLoader();
    SearchView.renderResults(state.search.result);
}