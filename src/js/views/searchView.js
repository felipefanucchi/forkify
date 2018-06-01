import { elements } from './base'

export const getUserInput = () => elements.searchInput.value;

export const cleanField = () => {
    elements.searchInput.value = '';
}

export const cleanList = () => {
    elements.searchResList.innerHTML = '';
}

const limitText = (text, limit = 17) => {
    if(text.length <= limit) return text;

    const newText = [];

    text.split(' ').reduce((acc, cur) => {
        if (acc + cur.length <= limit) {
            newText.push(cur)
        }
        return acc + cur.length
    }, 0);

    return `${newText.join(' ')}...`
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

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    recipes.forEach(renderRecipe);
}