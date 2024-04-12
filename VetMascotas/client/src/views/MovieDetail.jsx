import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const PlayerDetails = () => {
    const { piratesId } = useParams();
    const [player, setPlayer] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/player/${piratesId}`, {
                    withCredentials: true
                });
                
                setPlayer(response.data.pirate);
                setIsLoading(false);
            } catch (error) {
                setError(error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [piratesId]);

    const toggleFeature = async (feature) => {
        const updatedPlayer = {
            ...player,
            features: {
                ...player.features,
                [feature]: !player.features[feature]
            }
        };

        try {
            const response = await axios.put(`http://localhost:8000/api/player/${piratesId}`, updatedPlayer, {
                withCredentials: true
            });
            
            setPlayer(updatedPlayer);
        } catch (error) {
            setError(error);
        }
    };

    if (isLoading) {
        return <div className="spinner-border spinner-border-sm" role="status"><span className="visually-hidden">Loading...</span></div>;
    }

    if (error) {
        return <div className="alert alert-danger">Error: {error.message}</div>;
    }

    return (
        <div>
            <h2 className="mb-3 fs-5">Pirata Details</h2>
            {player && (
                <div className="card">
                    <div className="card-header bg-primary text-white">{player.name}</div>
                    <div className="card-body p-3">
                        <img src={player.image} alt={player.name} className="img-fluid mb-2" style={{ maxWidth: "200px", maxHeight: "200px" }} />
                        <p className="mb-1"><strong>Quantity:</strong> {player.quantity}</p>
                        <p className="mb-1"><strong>Description:</strong> {player.description}</p>
                        <p className="mb-1"><strong>Position:</strong> {player.position}</p>
                        <p className="mb-1"><strong>Features:</strong></p>
                        <ul className="list-unstyled mb-0">
                            <li className="mb-1">
                                Swords: 
                                <button
                                    className={`btn btn-sm mx-2 ${player.features.swords ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => toggleFeature('swords')}
                                >
                                    {player.features.swords ? 'Yes' : 'No'}
                                </button>
                            </li>
                            <li className="mb-1">
                                Treasure: 
                                <button
                                    className={`btn btn-sm mx-2 ${player.features.treasure ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => toggleFeature('treasure')}
                                >
                                    {player.features.treasure ? 'Yes' : 'No'}
                                </button>
                            </li>
                            <li className="mb-1">
                                Ship: 
                                <button
                                    className={`btn btn-sm mx-2 ${player.features.ship ? 'btn-success' : 'btn-danger'}`}
                                    onClick={() => toggleFeature('ship')}
                                >
                                    {player.features.ship ? 'Yes' : 'No'}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerDetails;
