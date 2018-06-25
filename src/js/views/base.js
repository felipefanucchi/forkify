export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchRes: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    searchResPage: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list')
}

export const elementsString = {
    loader: 'loader'
}

export const limitText = (text, limit = 17) => {
    if (text.length <= limit) return text;

    const newText = [];

    text.split(' ').reduce((acc, cur) => {
        if (acc + cur.length <= limit) {
            newText.push(cur)
        }
        return acc + cur.length
    }, 0);

    return `${newText.join(' ')} ...`
}

export const renderLoader = parent => {
    const markup = `
        <div class="${elementsString.loader}">
            <svg>
                <use xlink:href="img/icons.svg#icon-cw"/>
            </svg>
        </div>
    `;

    parent.insertAdjacentHTML('afterbegin', markup);
}

export const cleanLoader = () => {
    const loader = document.querySelector(`.${elementsString.loader}`);
    if(!loader) return; // This is because, we call the fn more than one time, and if there is no loader, it will throw an error
    loader.parentNode.removeChild(loader);
}