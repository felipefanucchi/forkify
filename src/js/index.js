import Search from './models/Search';
import * as SearchView from './views/SearchView';
import { elements } from './views/base';

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

const controllerSearch = async () => {
    // 1) Get the user input
    const query = SearchView.getUserInput();

    // 2) State the query to SEARCH obj
    state.search = new Search(query);

    // 3) update de UI
    SearchView.cleanField();
    SearchView.cleanList();

    // 4) Make the request
    await state.search.getResults();

    // 5) Show the result
    SearchView.renderResults(state.search.result);
}