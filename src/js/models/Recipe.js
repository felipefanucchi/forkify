import axios from 'axios';
import { BASE_URL, PROXY, KEY } from '../base';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${PROXY}${BASE_URL}/get?key=${KEY}&rId=${this.id}`);
            this.image = res.data.recipe.image_url;
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;
        } catch(err) {
            console.log(err);
        }
    }

    calcTime () {
        // Assume that we need 15 min for each 3 ing;
        const ings = this.ingredients.length;
        const periods = Math.ceil(ings / 3);

        this.time = periods * 15;
    }

    calcServings () {
        this.servings = 4;
    }
}