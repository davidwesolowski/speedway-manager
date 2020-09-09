import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import getToken from '../utils/getToken';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';
import { Divider, Typography } from '@material-ui/core';

interface IProps {
    matchId: string;
    homeId: string;
    awayId: string;
    homeScore: number;
    awayScore: number;
}

interface IClub {
    clubId: string;
    name: string;
    logoUrl: string;
}

const ListMatchesMatch: FunctionComponent<IProps> = ({
    matchId,
    homeId,
    awayId,
    homeScore,
    awayScore
}) => {

    const [home, setHome] = useState<IClub>();
    const [away, setAway] = useState<IClub>();
    const { push } = useHistory();

    const getClub = async (clubId: string, homeAway: string) => {
        if(homeAway === 'home'){
            try {
                const accessToken = getToken();
                const options = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                };
                const { data } = await axios.get(
                    `https://fantasy-league-eti.herokuapp.com/clubs/${clubId}`,
                    options
                );
                setHome(data);
            } catch (e) {
                console.log(e.response);
                if (e.response.statusText == 'Unauthorized') {
                    addNotification('Błąd', 'Sesja wygasła', 'danger', 3000);
                    setTimeout(() => {
                        push('/login');
                    }, 3000);
                } else {
                    addNotification(
                        'Błąd',
                        'Nie udało się pobrać gospodarza z bazy',
                        'danger',
                        3000
                    );
                }
                throw new Error('Error in getting home');
            }
        } else {
            try {
                const accessToken = getToken();
                const options = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                };
                const { data } = await axios.get(
                    `https://fantasy-league-eti.herokuapp.com/clubs/${clubId}`,
                    options
                );
                setAway(data);
            } catch (e) {
                console.log(e.response);
                if (e.response.statusText == 'Unauthorized') {
                    addNotification('Błąd', 'Sesja wygasła', 'danger', 3000);
                    setTimeout(() => {
                        push('/login');
                    }, 3000);
                } else {
                    addNotification(
                        'Błąd',
                        'Nie udało się pobrać gościa z bazy',
                        'danger',
                        3000
                    );
                }
                throw new Error('Error in getting away');
            }
        }
    }

    const generateMatchDiv = () => {
        if(home && away){
            return(
                <>
                    <div className="list-matches-match">
                        <div className="list-matches-match__home">
                            <img
                                src={
                                    home.logoUrl
                                        ? (home.logoUrl as string)
                                        : '/img/warsaw_venue.jpg'
                                }
                                alt="club-logo"
                                className="list-matches-match__club-image"
                            />
                            <Typography variant="h4">{home.name}</Typography>
                        </div>
                        <div className="list-matches-match__score">
                            <Typography variant="h3">55:35</Typography>
                        </div>
                        <div className="list-matches-match__away">
                            <img
                                src={
                                    away.logoUrl
                                        ? (away.logoUrl as string)
                                        : '/img/warsaw_venue.jpg'
                                }
                                alt="club-logo"
                                className="list-matches-match__club-image"
                            />
                            <Typography variant="h4">{away.name}</Typography>
                        </div>
                    </div>
                    <br/>
                </>
            )
        }
    }

    useEffect(() => {
        getClub(homeId, 'home');
        getClub(awayId, 'away');
    }, [])

    return(
        <>
            {generateMatchDiv()}
        </>
    )
}

export default ListMatchesMatch;