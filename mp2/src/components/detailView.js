import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../css/detailView.css";

function DetailView( prop ){
    const { id } = useParams();
    const navigate = useNavigate();
    const [pokemonDetail, setPokemonDetail] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then( (response) => {
            setPokemonDetail( response.data );
            setModalOpen(true);
        })
        .catch( (err) => {
            console.error( "Error fetching data: ", err );
        })
    }, [id] );


    const closeModal = () => {
        setModalOpen(false);
        navigate(-1);
    }

    const goToNextItem = () => {
        setModalOpen(false);
        const nextId = parseInt(id) + 1;
        console.log( "got next ID", `${nextId}` );
        navigate( `../../detail/${nextId}` , {replace: true});
    }

    const goToPrevItem = () => {
        setModalOpen(false);    
        const prevId = parseInt(id) - 1;
        console.log( "got prev ID", `${prevId}` );
        navigate( `../../detail/${prevId}`, {replace: true} );
    }

    if( !pokemonDetail ) return <div> Loading... </div>

    return (
        <>
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}> &times; </span>
                        <h2 className="pokemon-name"> {pokemonDetail.name} </h2>
                        <img className="pokemon-image" src={pokemonDetail.sprites.front_default} alt={pokemonDetail.name}/>
                        <div className="detail-information">
                            <p> HP: {pokemonDetail.stats[0].base_stat}</p>
                            <p> Attack: {pokemonDetail.stats[1].base_stat}</p>
                            <p> Defense: {pokemonDetail.stats[2].base_stat}</p>
                            <p> Speed: {pokemonDetail.stats[5].base_stat}</p>
                        </div>
                        <div className="navigation-button">
                            <button onClick={goToPrevItem}> Previous </button>
                            <button onClick={goToNextItem}> Next </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DetailView;