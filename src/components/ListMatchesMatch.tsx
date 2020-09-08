import React, { FunctionComponent, useState, useEffect } from 'react';

interface IProps {
    matchId: string;
    homeId: string;
    awayId: string;
    homeScore: number;
    awayScore: number;
}

const ListMatchesMatch: FunctionComponent<IProps> = ({
    matchId,
    homeId,
    awayId,
    homeScore,
    awayScore
}) => {

    const [home, setHome] = useState<Object>();
    const [away, setAway] = useState<Object>();

    const getClub = async (clubId: string, homeAway: string) => {
        if(homeAway === 'home'){
            //setHome()
        } else {
            //setAway()
        }
    }

    useEffect(() => {
        getClub(homeId, 'home');
        getClub(awayId, 'away');
    }, [])

    return(
        <>

        </>
    )
}

export default ListMatchesMatch;