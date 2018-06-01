import axios from 'axios';
import { BASE_URL, PROXY } from '../base';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        const key = 'eb4015e88554345d1c6f50d9196dc76d';
        try{
            const res = await axios(`${PROXY}${BASE_URL}?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
        } catch(err) {
            console.log(err)
        }
    }

}
