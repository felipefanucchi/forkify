import { elements, limitText } from './base'

export const getUserInput = () => elements.searchInput.value;

export const cleanField = () => {
    elements.searchInput.value = '';
}

export const cleanList = () => {
    elements.searchResList.innerHTML = '';
}
export const cleanResPage = () => {
    elements.searchResPage.innerHTML = '';
}

const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitText(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}

const buttonMarkup = (curPage, type) => `                
    <button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? curPage - 1 : curPage + 1}">
        <span>Page ${type === 'prev' ? curPage - 1 : curPage + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let buttons;

    if (page === 1 && pages > 1) {
        buttons = buttonMarkup(page, 'next');
    } else if (page > 1 && page < pages) {
        buttons = `
            ${buttonMarkup(page, 'prev')} 
            ${buttonMarkup(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        buttons = buttonMarkup(page, 'prev');
    }


    elements.searchResPage.insertAdjacentHTML('afterbegin', buttons);
}

export const renderResults = (recipes, page = 1, resPerPage = 6) => {
    /** Page 1
     * start = 1 - 1 * 7 = 0
     * end = 1 * 7 = 7
     * Page 2
     * start = 2 - 1 * 7 = 7
     * end = 2 * 7 = 14
     * Page 3 
     * start = 3 - 1 * 10 = 20
     * end = 3 * 10 = 30
     */
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    
    recipes.slice(start, end).forEach(renderRecipe);
    
    renderButtons(page, recipes.length, resPerPage)
}