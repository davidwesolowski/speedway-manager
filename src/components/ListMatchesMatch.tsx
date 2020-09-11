import React, { FunctionComponent, useState, useEffect } from 'react';
import axios from 'axios';
import getToken from '../utils/getToken';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';
import { Divider, Typography, Button, Dialog, MenuItem, Select, TextField, Checkbox } from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

interface IProps {
    matchId: string;
    homeId: string;
    awayId: string;
    homeScore: number;
    awayScore: number;
    riders: Array<IRider1>;
    date: Date;
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
    _id: string,
    firstName: string,
    lastName: string,
    nickname: string,
    dateOfBirth: Date,
    isForeigner: boolean,
    ksm: number,
    clubId: string
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

interface IRidersEdit{
    rider_1: IRiderEdit;
    rider_2: IRiderEdit;
    rider_3: IRiderEdit;
    rider_4: IRiderEdit;
    rider_5: IRiderEdit;
    rider_6: IRiderEdit;
    rider_7: IRiderEdit;
    rider_8: IRiderEdit;
    rider_9: IRiderEdit;
    rider_10: IRiderEdit;
    rider_11: IRiderEdit;
    rider_12: IRiderEdit;
    rider_13: IRiderEdit;
    rider_14: IRiderEdit;
    rider_15: IRiderEdit;
    rider_16: IRiderEdit;
}

interface IRiderEdit {
    riderId: string;
    points: number;
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
    riders,
    date
}) => {

    const [home, setHome] = useState<IClub>();
    const [away, setAway] = useState<IClub>();
    const [matchRiders, setMatchRiders] = useState<IRiders>(defaultRidersData);
    const { push } = useHistory();
    const [openScores, setOpenScores] = useState<boolean>(false);
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [wasRidden, setWasRidden] = useState<boolean>(false);
    const [wasRiddenEdit, setWasRiddenEdit] = useState<boolean>(false);
    const [matchRidersEdit, setMatchRidersEdit] = useState<IRidersEdit>();
    const [matchDateEdit, setMatchDateEdit] = useState<Date>(new Date(date));


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
                setHome({
                    clubId: data._id,
                    name: data.name,
                    logoUrl: data.logoUrl
                });
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
                setAway({
                    clubId: data._id,
                    name: data.name,
                    logoUrl: data.logoUrl
                });
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

    const setRidersEdit = () => {
        console.log(matchRiders)
        setMatchRidersEdit({
            rider_1: {
                points: matchRiders.rider_1.score,
                riderId: matchRiders.rider_1.riderId
            },
            rider_2: {
                points: matchRiders.rider_2.score,
                riderId: matchRiders.rider_2.riderId
            },
            rider_3: {
                points: matchRiders.rider_3.score,
                riderId: matchRiders.rider_3.riderId
            },
            rider_4: {
                points: matchRiders.rider_4.score,
                riderId: matchRiders.rider_4.riderId
            },
            rider_5: {
                points: matchRiders.rider_5.score,
                riderId: matchRiders.rider_5.riderId
            },
            rider_6: {
                points: matchRiders.rider_6.score,
                riderId: matchRiders.rider_6.riderId
            },
            rider_7: {
                points: matchRiders.rider_7.score,
                riderId: matchRiders.rider_7.riderId
            },
            rider_8: {
                points: matchRiders.rider_8.score,
                riderId: matchRiders.rider_8.riderId
            },
            rider_9: {
                points: matchRiders.rider_9.score,
                riderId: matchRiders.rider_9.riderId
            },
            rider_10: {
                points: matchRiders.rider_10.score,
                riderId: matchRiders.rider_10.riderId
            },
            rider_11: {
                points: matchRiders.rider_11.score,
                riderId: matchRiders.rider_11.riderId
            },
            rider_12: {
                points: matchRiders.rider_12.score,
                riderId: matchRiders.rider_12.riderId
            },
            rider_13: {
                points: matchRiders.rider_13.score,
                riderId: matchRiders.rider_13.riderId
            },
            rider_14: {
                points: matchRiders.rider_14.score,
                riderId: matchRiders.rider_14.riderId
            },
            rider_15: {
                points: matchRiders.rider_15.score,
                riderId: matchRiders.rider_15.riderId
            },
            rider_16: {
                points: matchRiders.rider_16.score,
                riderId: matchRiders.rider_16.riderId
            },
        })
    }

    const handleOpenEdit = () => {
        getMatchRiders();
        setWasRiddenEdit(wasRidden);
        setRidersEdit();
        setOpenEdit(true);
        console.log(openEdit)
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

    const generateScoresDialog = () => {
        return(
            <>
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

    const isU21 = date => {
        if(new Date().getFullYear() - new Date(date).getFullYear() < 22){
            return true
        } else {
           return false
        }
    }

    const isU23 = date => {
        console.log(new Date().getFullYear() - new Date(date).getFullYear() < 24)
        if(new Date().getFullYear() - new Date(date).getFullYear() < 24){
            return true
        } else {
           return false
        }
    }

    const selectRiders = (clubId, number, homeAway) => {
        if(number === 8){
            return riders.filter(filtered => filtered.clubId === clubId && isU23(filtered.dateOfBirth)/* &&
            !isChosen(filtered.id, 8, homeAway)*/).map((rider, index) => {
                return <MenuItem key={index} value={rider._id}>{rider.firstName} {rider.lastName}</MenuItem>
            })
        } else if(number === 6 || number === 7 ) {
            return riders.filter(filtered => filtered.clubId === clubId && isU21(filtered.dateOfBirth) && 
            !filtered.isForeigner/* && (!isChosen(filtered.id, 7, homeAway) || !isChosen(filtered.id, 6, homeAway))*/).map((rider, index) => {
                return <MenuItem key={index} value={rider._id}>{rider.firstName} {rider.lastName}</MenuItem>
            })
        } else {
            return riders.filter(filtered => filtered.clubId == clubId/* &&
                (!isChosen(filtered.id, 1, homeAway) || !isChosen(filtered.id, 2, homeAway) || !isChosen(filtered.id, 3, homeAway) || !isChosen(filtered.id, 4, homeAway) || !isChosen(filtered.id, 5, homeAway))*/).map((rider, index) => {
                    console.log(rider)
                    return <MenuItem key={index} value={rider._id}>{rider.firstName} {rider.lastName}</MenuItem>
            })
        }
    }

    const handleMatchDateOnChange = (date) => {
        setMatchDateEdit(date);
    }

    const selectRidersFields = () => {
        if(wasRiddenEdit && home && away){
            return(
                <>
                    <div className="add-match__away-div">
                        AWAY
                        <br/>
                        {away.name}
                        <br/>
                        <div className="add-match__rider-div">
                            1.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_1.riderId || ''} onChange={handleOnChangeSelectRider('rider_1', 'away')}>
                                {selectRiders(away.clubId, 1, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_1.points || ''} onChange={handleOnChangePoints('rider_1', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            2.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_2.riderId || ''} onChange={handleOnChangeSelectRider('rider_2', 'away')}>
                            {selectRiders(away.clubId, 2, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_2.points || ''} onChange={handleOnChangePoints('rider_2', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            3.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_3.riderId || ''} onChange={handleOnChangeSelectRider('rider_3', 'away')}>
                            {selectRiders(away.clubId, 3, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_3.points || ''} onChange={handleOnChangePoints('rider_3', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            4.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_4.riderId || ''} onChange={handleOnChangeSelectRider('rider_4', 'away')}>
                            {selectRiders(away.clubId, 4, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_4.points || ''} onChange={handleOnChangePoints('rider_4', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            5.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_5.riderId || ''} onChange={handleOnChangeSelectRider('rider_5', 'away')}>
                            {selectRiders(away.clubId, 5, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_5.points || ''} onChange={handleOnChangePoints('rider_5', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            6.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_6.riderId || ''} onChange={handleOnChangeSelectRider('rider_6', 'away')}>
                            {selectRiders(away.clubId, 6, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_6.points || ''} onChange={handleOnChangePoints('rider_6', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            7.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_7.riderId || ''} onChange={handleOnChangeSelectRider('rider_7', 'away')}>
                            {selectRiders(away.clubId, 7, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_7.points || ''} onChange={handleOnChangePoints('rider_7', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            8.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_8.riderId || ''} onChange={handleOnChangeSelectRider('rider_8', 'away')}>
                            {selectRiders(away.clubId, 8, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_8.points || ''} onChange={handleOnChangePoints('rider_8', 'away')}/>
                        </div>
                    </div>
                    <div className="add-match__home-div">
                        HOME
                        <br/>
                        {home.name}
                        <br/>
                        <div className="add-match__rider-div">
                            9.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_9.riderId || ''} onChange={handleOnChangeSelectRider('rider_1', 'home')}>
                            {selectRiders(home.clubId, 1, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_9.points || ''} onChange={handleOnChangePoints('rider_1', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            10.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_10.riderId || ''} onChange={handleOnChangeSelectRider('rider_2', 'home')}>
                            {selectRiders(home.clubId, 2, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_10.points || ''} onChange={handleOnChangePoints('rider_2', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            11.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_11.riderId || ''} onChange={handleOnChangeSelectRider('rider_3', 'home')}>
                            {selectRiders(home.clubId, 3, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_11.points || ''} onChange={handleOnChangePoints('rider_3', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            12.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_12.riderId || ''} onChange={handleOnChangeSelectRider('rider_4', 'home')}>
                            {selectRiders(home.clubId, 4, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_12.points || ''} onChange={handleOnChangePoints('rider_4', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            13.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_13.riderId || ''} onChange={handleOnChangeSelectRider('rider_5', 'home')}>
                            {selectRiders(home.clubId, 5, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_13.points || ''} onChange={handleOnChangePoints('rider_5', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            14.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_14.riderId || ''} onChange={handleOnChangeSelectRider('rider_6', 'home')}>
                            {selectRiders(home.clubId, 6, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_14.points || ''} onChange={handleOnChangePoints('rider_6', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            15.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_15.riderId || ''} onChange={handleOnChangeSelectRider('rider_7', 'home')}>
                            {selectRiders(home.clubId, 7, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_15.points || ''} onChange={handleOnChangePoints('rider_7', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            16.
                            <Select className="add-match__rider-select" value={matchRidersEdit.rider_16.riderId || ''} onChange={handleOnChangeSelectRider('rider_8', 'home')}>
                            {selectRiders(home.clubId, 8, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={matchRidersEdit.rider_16.points || ''} onChange={handleOnChangePoints('rider_8', 'home')}/>
                        </div>
                    </div>
                    <br/>
                    </>
            )
        } else {
            console.log(riders)
            return(
                <>
                    <div className="add-match__away-div">
                        AWAY
                        <br/>
                            {away ? away.name : ''}
                        <br/>
                    </div>
                    <div className="add-match__home-div">
                        HOME
                        <br/>
                            {home ? home.name : ''}
                        <br/>
                    </div>
                </>
            )
        }
    }

    const handleOnChangeSelectRider = (number: string, homeAway: string) => (
        event
    ) => {
        event.persist();
        const rider = parseInt(number.slice(-1));
        if(event.target) {
            if(homeAway === 'away'){
                const name = `rider_${rider}`
                switch(rider){
                    case 1:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_1.points}
                        }));
                        break;
                    case 2:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_2.points}
                        }));
                        break;
                    case 3:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_3.points}
                        }));
                        break;
                    case 4:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_4.points}
                        }));
                        break;
                    case 5:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_5.points}
                        }));
                        break;
                    case 6:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_6.points}
                        }));
                        break;
                    case 7:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_7.points}
                        }));
                        break;
                    case 8:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_8.points}
                        }));
                        break;
                    default:
                        break;
                }
            }
            else{
                switch(rider){
                    case 1:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_1.points}
                        }));
                        break;
                    case 2:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_2.points}
                        }));
                        break;
                    case 3:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_3.points}
                        }));
                        break;
                    case 4:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_4.points}
                        }));
                        break;
                    case 5:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_5.points}
                        }));
                        break;
                    case 6:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_6.points}
                        }));
                        break;
                    case 7:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_7.points}
                        }));
                        break;
                    case 8:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: event.target.value, points: matchRidersEdit.rider_8.points}
                        }));
                        break;
                    default:
                        break;
                }
            }
        };
    }

    const handleOnChangePoints = (rider: string, homeAway: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.persist();
        var number = parseInt(rider.slice(-1));
        if(event.target) {
            if(homeAway === 'away'){
                const name = `rider_${number}`
                switch(number){
                    case 1:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_1.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 2:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_2.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 3:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_3.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 4:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_4.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 5:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_5.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 6:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_6.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 7:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_7.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 8:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    default:
                        break
                }
            }
            else{
                number = number + 8;
                const name = `rider_${number}`
                switch(number){
                    case 1:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 2:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 3:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 4:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 5:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 6:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 7:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    case 8:
                        setMatchRidersEdit((prevState: IRidersEdit) => ({
                            ...prevState,
                            [name]: {riderId: matchRidersEdit.rider_8.riderId ,points: parseInt(event.target.value)}
                        }));
                        break;
                    default:
                        break;
                }
            }
        };
    }

    const handleOnChangeCheckbox = event => {
		event.persist();
		console.log(!event.target.checked);
		if (event.target) {
            setWasRiddenEdit(event.target.checked)
		}
    };
    
    const onClickEditButton = () => {
        checkDate();
        submitEditing();
    }

    const generateEditDialog = () => {
        return(
            <Dialog open={openEdit} onClose={handleCloseEdit} className="edit-dialog">
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog-1"
                        format="dd/MM/yyyy"
                        value={matchDateEdit}
                        onChange={handleMatchDateOnChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date'
                        }}
                    />
                </MuiPickersUtilsProvider>
                <br/>
                <Typography variant="h5">Czy mecz został rozegrany?</Typography>
                <Checkbox
                    onChange={handleOnChangeCheckbox}
                    size="small"
                    className="add-match__checkbox"
                    title="Zaznacz jeśli mecz został rozegrany"
                />
                {selectRidersFields()}
                <Button onClick={onClickEditButton}>
                    Edytuj
                </Button>
            </Dialog>
        )
        
    }

    const checkIfNew = (riderId, number, points) => {
        if(number < 9){
            if(riderId === matchRiders.rider_1.riderId){return true}
            else if(riderId === matchRiders.rider_2.riderId){return true}
            else if(riderId === matchRiders.rider_3.riderId){return true}
            else if(riderId === matchRiders.rider_4.riderId){return true}
            else if(riderId === matchRiders.rider_5.riderId){return true}
            else if(riderId === matchRiders.rider_6.riderId){return true}
            else if(riderId === matchRiders.rider_7.riderId){return true}
            else if(riderId === matchRiders.rider_8.riderId){return true}
        } else {
            if(riderId === matchRiders.rider_9.riderId){return true}
            else if(riderId === matchRiders.rider_10.riderId){return true}
            else if(riderId === matchRiders.rider_11.riderId){return true}
            else if(riderId === matchRiders.rider_12.riderId){return true}
            else if(riderId === matchRiders.rider_13.riderId){return true}
            else if(riderId === matchRiders.rider_14.riderId){return true}
            else if(riderId === matchRiders.rider_15.riderId){return true}
            else if(riderId === matchRiders.rider_16.riderId){return true}
        }

        addNewRiderMatch(riderId, matchId, number, points);
    }

    const checkIfChanged = (riderId, riderMatchId, number, points) => {
        if(number < 9){
            if(riderId === matchRidersEdit.rider_1.riderId){
                if(points !== matchRidersEdit.rider_1.points || number !== 1){
                    patchRiderMatch(riderMatchId, 1, matchRidersEdit.rider_1.points);
                }
            } else if(riderId === matchRidersEdit.rider_2.riderId){
                if(points !== matchRidersEdit.rider_2.points || number !== 2){
                    patchRiderMatch(riderMatchId, 2, matchRidersEdit.rider_2.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_3.riderId){
                if(points !== matchRidersEdit.rider_3.points || number !== 3){
                    patchRiderMatch(riderMatchId, 3, matchRidersEdit.rider_3.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_4.riderId){
                if(points !== matchRidersEdit.rider_4.points || number !== 4){
                    patchRiderMatch(riderMatchId, 4, matchRidersEdit.rider_4.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_5.riderId){
                if(points !== matchRidersEdit.rider_5.points || number !== 5){
                    patchRiderMatch(riderMatchId, 5, matchRidersEdit.rider_5.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_6.riderId){
                if(points !== matchRidersEdit.rider_6.points || number !== 6){
                    patchRiderMatch(riderMatchId, 6, matchRidersEdit.rider_6.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_7.riderId){
                if(points !== matchRidersEdit.rider_7.points || number !== 7){
                    patchRiderMatch(riderMatchId, 7, matchRidersEdit.rider_7.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_8.riderId){
                if(points !== matchRidersEdit.rider_8.points || number !== 8){
                    patchRiderMatch(riderMatchId, 8, matchRidersEdit.rider_8.points);
                }
            }
        } else {
            if(riderId === matchRidersEdit.rider_9.riderId){
                if(points !== matchRidersEdit.rider_9.points || number !== 9){
                    patchRiderMatch(riderMatchId, 9, matchRidersEdit.rider_9.points);
                }
            } else if(riderId === matchRidersEdit.rider_10.riderId){
                if(points !== matchRidersEdit.rider_10.points || number !== 10){
                    patchRiderMatch(riderMatchId, 10, matchRidersEdit.rider_10.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_11.riderId){
                if(points !== matchRidersEdit.rider_11.points || number !== 11){
                    patchRiderMatch(riderMatchId, 11, matchRidersEdit.rider_11.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_12.riderId){
                if(points !== matchRidersEdit.rider_12.points || number !== 12){
                    patchRiderMatch(riderMatchId, 12, matchRidersEdit.rider_12.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_13.riderId){
                if(points !== matchRidersEdit.rider_13.points || number !== 13){
                    patchRiderMatch(riderMatchId, 13, matchRidersEdit.rider_13.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_14.riderId){
                if(points !== matchRidersEdit.rider_14.points || number !== 14){
                    patchRiderMatch(riderMatchId, 14, matchRidersEdit.rider_14.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_15.riderId){
                if(points !== matchRidersEdit.rider_15.points || number !== 15){
                    patchRiderMatch(riderMatchId, 15, matchRidersEdit.rider_15.points);
                }
            } else
            if(riderId === matchRidersEdit.rider_16.riderId){
                if(points !== matchRidersEdit.rider_16.points || number !== 16){
                    patchRiderMatch(riderMatchId, 16, matchRidersEdit.rider_16.points);
                }
            }
        }
        deleteRiderMatch(riderMatchId);
    }

    const addNewRiderMatch = async (riderId, matchId, number, points) => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.post(
                `https://fantasy-league-eti.herokuapp.com/match-rider/${matchId}/riders/${riderId}`,
                {
                    riderId: riderId,
                    matchId: matchId,
                    score: points,
                    riderNumber: number
                },
                options
            );
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

    const patchRiderMatch = async (riderMatchId, number, points) => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.patch(
                `https://fantasy-league-eti.herokuapp.com/match-rider/${riderMatchId}`,
                {
                    score: points,
                    riderNumber: number
                },
                options
            );
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

    const deleteRiderMatch = async (riderMatchId) => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.delete(
                `https://fantasy-league-eti.herokuapp.com/match-rider/${riderMatchId}`,
                options
            );
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

    const submitEditing = () => {
        checkIfNew(matchRidersEdit.rider_1.riderId, 1, matchRidersEdit.rider_1.points);
        checkIfNew(matchRidersEdit.rider_2.riderId, 2, matchRidersEdit.rider_2.points);
        checkIfNew(matchRidersEdit.rider_3.riderId, 3, matchRidersEdit.rider_3.points);
        checkIfNew(matchRidersEdit.rider_4.riderId, 4, matchRidersEdit.rider_4.points);
        checkIfNew(matchRidersEdit.rider_5.riderId, 5, matchRidersEdit.rider_5.points);
        checkIfNew(matchRidersEdit.rider_6.riderId, 6, matchRidersEdit.rider_6.points);
        checkIfNew(matchRidersEdit.rider_7.riderId, 7, matchRidersEdit.rider_7.points);
        checkIfNew(matchRidersEdit.rider_8.riderId, 8, matchRidersEdit.rider_8.points);
        checkIfNew(matchRidersEdit.rider_9.riderId, 9, matchRidersEdit.rider_9.points);
        checkIfNew(matchRidersEdit.rider_10.riderId, 10, matchRidersEdit.rider_10.points);
        checkIfNew(matchRidersEdit.rider_11.riderId, 11, matchRidersEdit.rider_11.points);
        checkIfNew(matchRidersEdit.rider_12.riderId, 12, matchRidersEdit.rider_12.points);
        checkIfNew(matchRidersEdit.rider_13.riderId, 13, matchRidersEdit.rider_13.points);
        checkIfNew(matchRidersEdit.rider_14.riderId, 14, matchRidersEdit.rider_14.points);
        checkIfNew(matchRidersEdit.rider_15.riderId, 15, matchRidersEdit.rider_15.points);
        checkIfNew(matchRidersEdit.rider_16.riderId, 16, matchRidersEdit.rider_16.points);

        checkIfChanged(matchRiders.rider_1.riderId, matchRiders.rider_1.matchRiderId, matchRiders.rider_1.riderNumber, matchRiders.rider_1.score);
        checkIfChanged(matchRiders.rider_2.riderId, matchRiders.rider_2.matchRiderId, matchRiders.rider_2.riderNumber, matchRiders.rider_2.score);
        checkIfChanged(matchRiders.rider_3.riderId, matchRiders.rider_3.matchRiderId, matchRiders.rider_3.riderNumber, matchRiders.rider_3.score);
        checkIfChanged(matchRiders.rider_4.riderId, matchRiders.rider_4.matchRiderId, matchRiders.rider_4.riderNumber, matchRiders.rider_4.score);
        checkIfChanged(matchRiders.rider_5.riderId, matchRiders.rider_5.matchRiderId, matchRiders.rider_5.riderNumber, matchRiders.rider_5.score);
        checkIfChanged(matchRiders.rider_6.riderId, matchRiders.rider_6.matchRiderId, matchRiders.rider_6.riderNumber, matchRiders.rider_6.score);
        checkIfChanged(matchRiders.rider_7.riderId, matchRiders.rider_7.matchRiderId, matchRiders.rider_7.riderNumber, matchRiders.rider_7.score);
        checkIfChanged(matchRiders.rider_8.riderId, matchRiders.rider_8.matchRiderId, matchRiders.rider_8.riderNumber, matchRiders.rider_8.score);
        checkIfChanged(matchRiders.rider_9.riderId, matchRiders.rider_9.matchRiderId, matchRiders.rider_9.riderNumber, matchRiders.rider_9.score);
        checkIfChanged(matchRiders.rider_10.riderId, matchRiders.rider_10.matchRiderId, matchRiders.rider_10.riderNumber, matchRiders.rider_10.score);
        checkIfChanged(matchRiders.rider_11.riderId, matchRiders.rider_11.matchRiderId, matchRiders.rider_11.riderNumber, matchRiders.rider_11.score);
        checkIfChanged(matchRiders.rider_12.riderId, matchRiders.rider_12.matchRiderId, matchRiders.rider_12.riderNumber, matchRiders.rider_12.score);
        checkIfChanged(matchRiders.rider_13.riderId, matchRiders.rider_13.matchRiderId, matchRiders.rider_13.riderNumber, matchRiders.rider_13.score);
        checkIfChanged(matchRiders.rider_14.riderId, matchRiders.rider_14.matchRiderId, matchRiders.rider_14.riderNumber, matchRiders.rider_14.score);
        checkIfChanged(matchRiders.rider_15.riderId, matchRiders.rider_15.matchRiderId, matchRiders.rider_15.riderNumber, matchRiders.rider_15.score);
        checkIfChanged(matchRiders.rider_16.riderId, matchRiders.rider_16.matchRiderId, matchRiders.rider_16.riderNumber, matchRiders.rider_16.score);
    }

    const checkDate = async () => {
        if(matchDateEdit != date){
            try {
                const accessToken = getToken();
                const options = {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                };
                const { data } = await axios.patch(
                    `https://fantasy-league-eti.herokuapp.com/matches/${matchId}`,
                    {date: matchDateEdit},
                    options
                );
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

    useEffect(() => {
        getClub(homeId, 'home');
        getClub(awayId, 'away');
    }, [])

    return(
        <>
            {generateMatchDiv()}
            {generateScoresDialog()}
            {generateEditDialog()}
        </>
    )
}

export default ListMatchesMatch;