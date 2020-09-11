import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import getToken from '../utils/getToken';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';
import { Divider, Typography, Button, Dialog } from '@material-ui/core';

interface IProps {
    matchId: string;
    homeId: string;
    awayId: string;
    homeScore: number;
    awayScore: number;
    riders: Array<IRider1>;
}

interface IRider{
    matchRiderId: string;
    riderId: string;
    firstName: string;
    lastName: string;
    score: number;
    riderNumber: number;
}

interface IRider1{
    riderId: string;
    firstName: string;
    lastName: string;
}

interface IRiders{
    rider_1: IRider;
    rider_2: IRider;
    rider_3: IRider;
    rider_4: IRider;
    rider_5: IRider;
    rider_6: IRider;
    rider_7: IRider;
    rider_8: IRider;
    rider_9: IRider;
    rider_10: IRider;
    rider_11: IRider;
    rider_12: IRider;
    rider_13: IRider;
    rider_14: IRider;
    rider_15: IRider;
    rider_16: IRider;
}

interface IClub {
    clubId: string;
    name: string;
    logoUrl: string;
}
const defaultRiderData = {
    matchRiderId: '',
    riderId: '',
    firstName: '',
    lastName: '',
    score: 0,
    riderNumber: 0
}

const defaultRidersData = {
    rider_1: defaultRiderData,
    rider_2: defaultRiderData,
    rider_3: defaultRiderData,
    rider_4: defaultRiderData,
    rider_5: defaultRiderData,
    rider_6: defaultRiderData,
    rider_7: defaultRiderData,
    rider_8: defaultRiderData,
    rider_9: defaultRiderData,
    rider_10: defaultRiderData,
    rider_11: defaultRiderData,
    rider_12: defaultRiderData,
    rider_13: defaultRiderData,
    rider_14: defaultRiderData,
    rider_15: defaultRiderData,
    rider_16: defaultRiderData
}

const ListMatchesMatch: FunctionComponent<IProps> = ({
    matchId,
    homeId,
    awayId,
    homeScore,
    awayScore,
    riders
}) => {

    const [home, setHome] = useState<IClub>();
    const [away, setAway] = useState<IClub>();
    const [matchRiders, setMatchRiders] = useState<IRiders>(defaultRidersData);
    const { push } = useHistory();
    const [openScores, setOpenScores] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [wasRidden, setWasRidden] = useState<boolean>(false);

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

    const handleOpenScores = () => {
        //if(wasRidden){
            getMatchRiders();
            setOpenScores(true);
            console.log(matchRiders);
        //}
    }

    const handleCloseScores = () => {
        setOpenScores(false)
    }

    const handleOpenEdit = () => {
        setOpenEdit(true)
    }

    const handleCloseEdit = () => {
        setOpenEdit(false)
    }

    const setMatchRider = (name, rider) => {
        setMatchRiders((prevState: IRiders) => ({
            ...prevState,
            [name]: {
                matchRiderId: rider._id,
                riderId: rider.riderId,
                firstName: rider.rider.firstName,
                lastName: rider.rider.lastName,
                score: rider.score,
                riderNumber: rider.riderNumber
            }                        
        }));
    }

    const getMatchRiders = async () => {
        if(matchRiders === defaultRidersData){
            try {
                const accessToken = getToken();
                const options = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                };
                const { data } = await axios.get(
                    `https://fantasy-league-eti.herokuapp.com/match-rider/${matchId}/riders`,
                    options
                );
                data.map((rider, index) => {
                    console.log(rider)
                    switch(rider.riderNumber){
                        case 1:
                            setMatchRider('rider_1', rider);
                            break;
                        case 2:
                            setMatchRider('rider_2', rider);
                            break;
                        case 3:
                            setMatchRider('rider_3', rider);
                            break;
                        case 4:
                            setMatchRider('rider_4', rider);
                            break;
                        case 5:
                            setMatchRider('rider_5', rider);
                            break;
                        case 6:
                            setMatchRider('rider_6', rider);
                            break;
                        case 7:
                            setMatchRider('rider_7', rider);
                            break;
                        case 8:
                            setMatchRider('rider_8', rider);
                            break;
                        case 9:
                            setMatchRider('rider_9', rider);
                            break;
                        case 10:
                            setMatchRider('rider_10', rider);
                            break;
                        case 11:
                            setMatchRider('rider_11', rider);
                            break;
                        case 12:
                            setMatchRider('rider_12', rider);
                            break;
                        case 13: 
                            setMatchRider('rider_13', rider);
                            break;
                        case 14:
                            setMatchRider('rider_14', rider);
                            break;
                        case 15:
                            setMatchRider('rider_15', rider);
                            break;
                        case 16:
                            setMatchRider('rider_16', rider);
                            break;
                        default:
                            break;
                    }
                })
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
                        'Nie udało się pobrać rund z bazy',
                        'danger',
                        3000
                    );
                }
                throw new Error('Error in getting rounds');
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
                        <div className="list-matches-match__options">
                            <Button className="list-matches-match__scores-button" onClick={handleOpenScores} /*disabled={!wasRidden}*/ >
                                Wyniki
                            </Button>
                            <Button className="list-matches-match__edit-button" onClick={handleOpenEdit}>
                                Edytuj
                            </Button>
                        </div>
                    </div>
                    <Divider/>
                    <br/>
                </>
            )
        }
    }

    const generateRiderScoreDiv = (firstName, lastName, score, number) => {
        return(
            <>
            <div className="scores-dialog__rider-score-div">
                <div className="scores-dialog__rider">
                    {number}. {firstName} {lastName}
                </div>
                <div className="scores-dialog__score">
                    {score === 0 ? '' : score}
                </div>
            </div>
            <Divider/>
            </>
        )
    }

    useEffect(() => {
        getClub(homeId, 'home');
        getClub(awayId, 'away');
    }, [])

    return(
        <>
            {generateMatchDiv()}
            <Dialog open={openScores} onClose={handleCloseScores} className="scores-dialog">
                <div className="scores-dialog__away">
                    <Typography variant="h3" className="scores-dialog__club-name">
                        {away ? away.name : ''}
                    </Typography>
                    <img
                        src={
                            away
                                ? (away.logoUrl ? (away.logoUrl as string)
                                : '/img/warsaw_venue.jpg') : '/img/warsaw_venue.jpg'
                        }
                        alt="club-logo"
                        className="scores-dialog__club-image"
                    />
                    WYNIK
                    {generateRiderScoreDiv(matchRiders.rider_1.firstName, matchRiders.rider_1.lastName, matchRiders.rider_1.score, 1)}
                    {generateRiderScoreDiv(matchRiders.rider_2.firstName, matchRiders.rider_2.lastName, matchRiders.rider_2.score, 2)}
                    {generateRiderScoreDiv(matchRiders.rider_3.firstName, matchRiders.rider_3.lastName, matchRiders.rider_3.score, 3)}
                    {generateRiderScoreDiv(matchRiders.rider_4.firstName, matchRiders.rider_4.lastName, matchRiders.rider_4.score, 4)}
                    {generateRiderScoreDiv(matchRiders.rider_5.firstName, matchRiders.rider_5.lastName, matchRiders.rider_5.score, 5)}
                    {generateRiderScoreDiv(matchRiders.rider_6.firstName, matchRiders.rider_6.lastName, matchRiders.rider_6.score, 6)}
                    {generateRiderScoreDiv(matchRiders.rider_7.firstName, matchRiders.rider_7.lastName, matchRiders.rider_7.score, 7)}
                    {generateRiderScoreDiv(matchRiders.rider_8.firstName, matchRiders.rider_8.lastName, matchRiders.rider_8.score, 8)}
                </div>
                <div className="scores-dialog__home">
                    <Typography variant="h3" className="scores-dialog__club-name">
                        {home ? home.name : ''}
                    </Typography>
                    <img
                        src={
                            home
                                ? (home.logoUrl ? (home.logoUrl as string)
                                : '/img/warsaw_venue.jpg') : '/img/warsaw_venue.jpg'
                        }
                        alt="club-logo"
                        className="scores-dialog__club-image"
                    />
                    WYNIK
                    {generateRiderScoreDiv(matchRiders.rider_9.firstName, matchRiders.rider_9.lastName, matchRiders.rider_9.score, 9)}
                    {generateRiderScoreDiv(matchRiders.rider_10.firstName, matchRiders.rider_10.lastName, matchRiders.rider_10.score, 10)}
                    {generateRiderScoreDiv(matchRiders.rider_11.firstName, matchRiders.rider_11.lastName, matchRiders.rider_11.score, 11)}
                    {generateRiderScoreDiv(matchRiders.rider_12.firstName, matchRiders.rider_12.lastName, matchRiders.rider_12.score, 12)}
                    {generateRiderScoreDiv(matchRiders.rider_13.firstName, matchRiders.rider_13.lastName, matchRiders.rider_13.score, 13)}
                    {generateRiderScoreDiv(matchRiders.rider_14.firstName, matchRiders.rider_14.lastName, matchRiders.rider_14.score, 14)}
                    {generateRiderScoreDiv(matchRiders.rider_15.firstName, matchRiders.rider_15.lastName, matchRiders.rider_15.score, 15)}
                    {generateRiderScoreDiv(matchRiders.rider_16.firstName, matchRiders.rider_16.lastName, matchRiders.rider_16.score, 16)}
                </div>
            </Dialog>
        </>
    )
}

export default ListMatchesMatch;