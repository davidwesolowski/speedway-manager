import React, { FunctionComponent, useState } from 'react';
import { Typography } from '@material-ui/core';

interface IProps {
    round: number;
    startDate: Date;
    endDate: Date;
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
    startDate,
    endDate
}) => {

    const [matches, setMatches] = useState<IMatch[]>([]);

    const getMatchesOfRound = async (round) => {

    }

    const generateMatches = () => {
        if(matches.length === 0){
            return(
                <div>Brak danych o meczach w tej kolejce</div>
            )
        }
        else{
            
        }
    }

    return(
        <>
            <div className="list-matches-round">
                <Typography
                    variant="h4"
                    className="list-matches-round__title"
                >
                    Kolejka {round}. ({startDate} - {endDate})
                </Typography>
                {generateMatches()}
            </div>
        </>
    )
};

export default ListMatchesRound;