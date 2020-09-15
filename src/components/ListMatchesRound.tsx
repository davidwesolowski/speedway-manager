import React, { FunctionComponent, useState, useEffect } from 'react';
import { Typography, Divider } from '@material-ui/core';
import ListMatchesMatch from './ListMatchesMatch';
import getToken from '../utils/getToken';
import axios from 'axios';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';

interface IProps {
    round: number;
    roundId: string;
    startDate: string;
    endDate: string;
    riders: Array<IRider>
}

interface IRider{
    _id: string,
    firstName: string,
    lastName: string,
    nickname: string,
    dateOfBirth: Date,
    isForeigner: boolean,
    ksm: number,
    clubId: string
}

interface IMatch {
    matchId: string;
    homeId: string;
    awayId: string;
    homeScore: number;
    awayScore: number;
}

const ListMatchesRound: FunctionComponent<IProps> = ({
    round,
    roundId,
    startDate,
    endDate,
    riders
}) => {
    const [matches, setMatches] = useState([]);
    const { push } = useHistory();

    const getMatchesOfRound = async (roundId) => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.get(
                `https://fantasy-league-eti.herokuapp.com/matches?roundId=${roundId}`,
                options
            );
            setMatches([]);
            setMatches(data);
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
                    'Nie udało się pobrać meczów z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in getting matches');
        }
    }

    const generateMatches = () => {
        if(matches.length === 0 && round !== 0){
            return(
                <>
                <div>Brak danych o meczach w tej kolejce</div>
                </>
            )
        }
        else if(round !== 0){
            return matches.map((match, index) => {
                return(
                    <>
                    <ListMatchesMatch
                        key={`${index}_${match.homeId}`}
                        matchId={match._id}
                        homeId={match.homeId}
                        awayId={match.awayId}
                        homeScore={match.homeScore}
                        awayScore={match.awayScore}
                        riders={riders}
                        date={match.date}
                        wasRidden={match.wasRidden}
                    />
                    </>
                )
            })
        }
    }

    const generateRoundTitle = () => {
        if(round !== 0){
            return(
                `Kolejka ${round}. ( ${(new Date(startDate)).toLocaleDateString()} - ${(new Date(endDate)).toLocaleDateString()} )`
            )
        }
    }

    useEffect(() => {
        getMatchesOfRound(roundId)
    }, [])

    return(
        <>
            <div className="list-matches-round">
                <Typography
                    variant="h4"
                    className="list-matches-round__title"
                >
                    {generateRoundTitle()}
                </Typography>
                <Divider/>
                {generateMatches()}
            </div>
        </>
    )
};

export default ListMatchesRound;