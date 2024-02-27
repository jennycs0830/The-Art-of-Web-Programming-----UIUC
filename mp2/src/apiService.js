import axios from 'axios';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

export const getPokemonList = async(limit = 100) => {
    try{
        const response = await axios.get( `${API_BASE_URL}/pokemon?limit=${limit}`);
        console.log( response.data.results );
        return response.data.results;
    }
    catch( error ){
        throw error;
    }
}