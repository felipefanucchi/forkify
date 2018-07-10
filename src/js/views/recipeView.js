import { elements } from './base';
import { Fraction } from 'fractional';

export const formatCount = count => {
    if(!count) return;

    const newcount = Math.round(count * 10000) / 10000;

    const [int, dec] = newcount.toString().split('.').map(el => parseInt(el));
    // Steps 

    /**
     * 1) Se nao houver decimal, simplesmente retorna o inteiro
     * 2) Caso haja um decimal, porem nao haja um inteiro,
     * Devo fracionar o decimal e retornar o valor fracionado ex: new Fraction(dec)
     * 3) Caso haja um inteiro e um decimal, devo somente fracionar o decimal e retornar o inteiro
     * Ex: new Fraction(int - newcount) = new Fraction(1 - 1.5) = 0.5 e entao retorno um template string com ambos
    */

    if(!dec) {
        return int
    } else if(int === 0) {
        return new Fraction(newcount)
    } else {
        const decFraction = new Fraction(newcount - int);
        return `${int} ${decFraction}`
    }

    return '?'
};

export const renderRecipe = (recipe, isLiked) => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.image}" alt="Tomato" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>
        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">4</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>



        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join(' ')}
            </ul>

            <button class="btn-small recipe__btn recipe_btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Directions</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;

    elements.recipe.insertAdjacentHTML('afterbegin', markup);
}

const createIngredient = ingredient => {
    return `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>`
}

export const cleanRecipe = () => {
    elements.recipe.innerHTML = '';
}

export const updateCountIng = recipe => {
    const data = document.querySelector('.recipe__info-data--people');

    data.textContent = recipe.servings;

    const newCounts = Array.from(document.querySelectorAll('.recipe__count'));

    newCounts.forEach((ing, i) => {
        ing.textContent = formatCount(recipe.ingredients[i].count)
    })
}