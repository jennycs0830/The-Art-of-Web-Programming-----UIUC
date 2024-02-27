import React, {useState, useEffect} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { getPokemonList } from '../apiService';
import "../css/galleryView.css";
import { useNavigate } from 'react-router-dom';

function PokemonCard( {pokemon} ){
    const navigate = useNavigate();

    const handlePokemonClick = () => {
        console.log( "got pokemon ID", `${pokemon.id}` );
        navigate( `../detail/${pokemon.id}` );
    };

    return (
        <div className='pokemon-card' onClick={handlePokemonClick}>
            <h4> {pokemon.name} </h4>
            <img src = {pokemon.sprites.front_default} alt={pokemon.name}/>
            <p> Types: {pokemon.types[0].type.name}</p>
        </div>
    );
}

PokemonCard.propTypes = {
    pokemon: PropTypes.shape({
        name: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
        sprites: PropTypes.shape({
            front_default: PropTypes.string.isRequired
        }).isRequired,
        types: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.shape({
                    name: PropTypes.string.isRequired
                }).isRequired
            })
        ).isRequired
    }).isRequired
};

function TypeFilter({types, onFilterChange} ){
    return (
        <div className='type-filter'>
            {types.map( type => (
                <label key = {type} >
                    <input 
                        type = "checkbox" 
                        value= {type} 
                        onChange={ (event) => onFilterChange( type, event.target.checked )}
                    />
                    {type}
                </label>
            ))}
        </div>
    );
}

TypeFilter.propTypes = {
    types: PropTypes.arrayOf(PropTypes.string).isRequired,
    onFilterChange: PropTypes.func.isRequired
};

function GalleryView() {
    const [pokemonDetail, setPokemonDetail] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const types = ["water", "fire", "grass", "ghost", "bug", "normal", "poison", "electric", "ground", "fairy", "fighting", "psychic", "rock"];
    
    useEffect(() => {
        getPokemonList()
        .then( (data) => {
            return Promise.all( data.map( pokemon => axios.get( pokemon.url ) ) );
        })
        .then( (details) => {
            const detailedData = details.map( detail => detail.data );
            setPokemonDetail( detailedData );
            setPokemonDetail( details.map( detail => detail.data ));
        })
        .catch( (err) => {
            console.error( "Error fetching data: ", err );
        })
    }, []);

    const handleFilterChange = (type, isChecked) => {
        if( isChecked && !selectedTypes.includes(type) ){
            setSelectedTypes([...selectedTypes, type]);
        }
        else if( !isChecked ){
            setSelectedTypes( selectedTypes.filter( t => t !== type));
        }
    }

    useEffect(() => {
        if (selectedTypes.length === 0) {
            setFilteredPokemon(pokemonDetail);
        } else {
            // Filter Pokémon based on the selected types
            // Note: This example assumes you have a "types" property for each Pokémon
            const newFilteredPokemon = pokemonDetail.filter(pokemon => 
                selectedTypes.includes(pokemon.types[0].type.name)
            );
            setFilteredPokemon(newFilteredPokemon);
        }
    }, [selectedTypes, pokemonDetail]);

    return (
        <div className="gallery-view">
            <TypeFilter types={types} onFilterChange={handleFilterChange} />
            <div className="pokemon-gallery">
                {filteredPokemon.map(pokemon => {
                    console.log( pokemon );
                    return<PokemonCard key={pokemon.name} pokemon={pokemon} />
                })}
            </div>
        </div>
    );
}

export default GalleryView;
