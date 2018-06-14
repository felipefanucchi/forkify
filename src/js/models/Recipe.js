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
    
    updateServings (type) {
        const newServings = (type === 'inc') ? this.servings + 1 : this.servings -1;

        this.ingredients.forEach(ing =>{
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
    
    parseIng() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];

        const newIng = this.ingredients.map(e => {
            // 1) Uniform units
            let ing = e.toLowerCase();
            
            unitsLong.forEach((unit, i) => {
               ing = ing.replace(unit, unitsShort[i])
            });

            // 2) Remove Parentheses
            ing = ing.replace(/ *\([^)]*\) */g, " ");

            // 3) Parse ingredients into, count, unit and ingredient into COUNT, UNIT and INGREDIENT.
            const arrEachIng = ing.split(' ');
            const unitIndex = arrEachIng.findIndex(el => unitsShort.includes(el));
            let objIng;

            if(unitIndex > -1) {
                // There is UNIT
                const arrCount = arrEachIng.slice(0, unitIndex);
                let count;

                if(arrCount.length === 1) {
                    count = eval(arrEachIng[0].replace('-','+'));
                } else {
                    count = eval(arrEachIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrEachIng[unitIndex],
                    ingredient: arrEachIng.slice(unitIndex + 1).join(' ')
                }
            } else if(parseInt(arrEachIng[0])) {
                // There is a number instead a unit
                objIng = {
                    count: parseInt(arrEachIng[0]),
                    unit: '',
                    ingredient: arrEachIng.slice(1).join(' ')
                }
            } else if(unitIndex === -1) {
                // There is NO UNIT
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient: ing
                }
            }


            return objIng; 
        });
        this.ingredients = newIng;
    }

}