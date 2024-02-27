import React, {useState, useEffect} from 'react';
import { getPokemonList } from '../apiService';
import axios from 'axios';
import PropTypes from 'prop-types';
import "../css/listView.css";
import { useNavigate } from 'react-router-dom';

function PokemonContainer( {pokemon} ){
    const navigate = useNavigate();

    const handlePokemonClick = () => {
        console.log( "got pokemon ID", `${pokemon.id}` );
        navigate( `detail/${pokemon.id}` );
    };
    
    return (
        <div className='pokemon-container' onClick={handlePokemonClick}>
            <img src = {pokemon.sprites.front_default} alt={`${pokemon.species.name} sprite`} />
            <div className='pokemon_details'>
                <h3>{pokemon.species.name}</h3>
                <p> Experience: {pokemon.base_experience} </p>
                <p> Height: {pokemon.height} </p>
                <p> Weight: {pokemon.weight} </p>
            </div>
        </div>
    )
}

PokemonContainer.propTypes = {
    pokemon: PropTypes.shape({
        id: PropTypes.number.isRequired,
        species: PropTypes.shape({
            name: PropTypes.string.isRequired
        }).isRequired,
        sprites: PropTypes.shape({
            front_default: PropTypes.string
        }).isRequired,
        base_experience: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        weight: PropTypes.number.isRequired
    }).isRequired
};
    

function ListView(){
    const [query, setQuery] = useState("");
    const [pokemonData, setPokemonData] = useState([]);
    const [pokemonDetail, setPokemonDetail] = useState([]);
    const [sortProperty, setSortProperty] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");

    useEffect(() => {
        getPokemonList()
        .then( (data) => {
            setPokemonData( data );
            
            return Promise.all( data.map( pokemon => axios.get( pokemon.url ) ) );
        })
        .then( (details) => {
            setPokemonDetail( details.map( detail => detail.data ));
        })
        .catch( (err) => {
            console.error( "Error fetching data: ", err );
        })
    }, [] );

    useEffect(() => {
        console.log("Updated Pokémon data:", pokemonData);
    }, [pokemonData]);

    const filteredPokemon = pokemonDetail.filter( pokemon => {
        return pokemon.species.name.toLowerCase().includes( query.toLowerCase() );
    });

    const sortedPokemon = [...filteredPokemon].sort((a, b) => {
        let comparison = 0;
        switch( sortProperty ){
            case 'name':
                comparison = a.species.name.localeCompare(b.species.name);
                break;
            case 'experience':
                comparison = a.base_experience - b.base_experience;
                break;
            case 'height':
                comparison = a.height - b.height;
                break;
            case 'weight':
                comparison = a.weight - b.weight;
                break;
            default:
                comparison = a.species.name.localeCompare(b.species.name);
        }
        return sortOrder === "desc" ? -comparison: comparison;
    })

    return (
        <div className='SearchBox'>
            <input 
                type = "text" 
                value = {query} 
                onChange={(event) => {
                    console.log( "Input changed: ", event.target.value );
                    setQuery( event.target.value )}
                }
                placeholder="Search Pokemon..." />
            <div className='sortAttr'>
                <label>
                    Sort by : 
                    <select value = {sortProperty} 
                            onChange={ (event) => setSortProperty(event.target.value)} >
                        <option value = "name"> Name </option>
                        <option value = "experience"> Experience </option>
                        <option value = "height"> Height </option>
                        <option value = "weight"> Weight </option>
                    </select>
                </label>
                <label>
                    Order : 
                    <select value = {sortOrder}
                            onChange = {(event) => setSortOrder( event.target.value )}>
                        <option value = "asc"> Ascending </option>
                        <option value = "desc"> Decending </option>
                    </select>
                </label>
            </div>
            <ul>
                {sortedPokemon.map((pokemon, index) => {
                    return (
                        <li key = {index} >
                            <PokemonContainer pokemon = {pokemon} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default ListView;