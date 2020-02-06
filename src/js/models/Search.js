import axios from 'axios';
import { BASE_URL, PROXY, KEY } from '../base';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try{
            const res = await axios(`${BASE_URL}/search?q=${this.query}`);
            this.result = res.data.recipes;
        } catch(err) {
            console.log(err)
        }
    }

}
