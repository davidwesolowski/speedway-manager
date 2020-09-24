import { Divider, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setUser } from '../actions/userActions';
import addNotification from '../utils/addNotification';
import { checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';

const TeamHistory : FunctionComponent<RouteComponentProps> = ({history: { push }}) => {

    const {
        setLoggedIn,
		dispatchUserData,
		userData,
    } = useStateValue();

    const fetchUserData = async () => {
        const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
        try {
            const {
                data: { username, email, avatarUrl }
            } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/users/self',
                options
            );
            dispatchUserData(setUser({ username, email, avatarUrl }));
            setLoggedIn(true);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            }
        }
    };

    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState<string>('all');
    const [historyRiders, setHistoryRiders] = useState([]);
    const [updatedRiders, setUpdatedRiders] = useState<boolean>(true);

    const [tempHistoryRiders, setTempHistoryRiders] = useState([
        {
            _id: 1,
            firstName: "Bartosz",
            lastName: "Zmarzlik",
            club: "Stal Gorzów",
            KSM: 10,
            score: 15
        },
        {
            _id: 2,
            firstName: "Bartosz",
            lastName: "Zmarzlik",
            club: "Stal Gorzów",
            KSM: 10,
            score: 14
        },
        {
            _id: 3,
            firstName: "Bartosz",
            lastName: "Zmarzlik",
            club: "Stal Gorzów",
            KSM: 10,
            score: 13
        }
    ])

    const getRounds = async () => {
        try{
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const {data} = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/rounds',
                options
            );

            setRounds(data);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
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

    const getHistoryRiders = async () => {
        setUpdatedRiders(false);

        /*try{
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const {data} = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/history-riders',
                options
            );

            setHistoryRiders(data);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
                addNotification(
                    'Błąd',
                    'Nie udało się pobrać rund z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in getting rounds');
        }*/

        setUpdatedRiders(true);
    }

    const generateRounds = () => {
        return rounds.map((round, index) => {
            return(
                <MenuItem key={index} value={round._id}>{round.number}</MenuItem>
            )
        })
    }

    const handleOnChangeSelect = () => event => {
        event.persist();
        if(event.target){
            setSelectedRound(event.target.value);
        }
    }

    const generateTable = () => {
        if(updatedRiders){
            return(
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Imię</TableCell>
                                <TableCell>Nazwisko</TableCell>
                                <TableCell>KSM</TableCell>
                                <TableCell>Klub</TableCell>
                                <TableCell>Wynik</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tempHistoryRiders.map(rider => (
                                <TableRow key={rider._id} hover={true}>
                                    <TableCell></TableCell>
                                    <TableCell>{rider.firstName}</TableCell>
                                    <TableCell>{rider.lastName}</TableCell>
                                    <TableCell>{rider.KSM}</TableCell>
                                    <TableCell>{rider.club}</TableCell>
                                    <TableCell>{rider.score}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) 
        } else {
            return(
                <div></div>
            )
        }
    }

    useEffect(() => {
        if (!userData.username) fetchUserData();
        getRounds();
        setTimeout(() => {
			document.body.style.overflow = 'auto';
		}, 2000);
    }, [])

    return(
        <>
            <div className="history">
                <div className="history__background"></div>
                <Paper className="history__box">
                    <Typography
                        variant="h2"
                        className="heading-1 history__heading"
                    >
                        Historia składu
                    </Typography>
                    <Divider />
                    <br/>
                    <Select value={selectedRound || ''} onChange={handleOnChangeSelect()}>
                        <MenuItem key='all' value='all'>Wszystkie kolejki</MenuItem>
                        {generateRounds()}
                    </Select>
                    <br/>
                    <div className='history__full-score'>
                        <Typography variant='h1' className='history__full-score-text'>
                            Łączny wynik:
                            <br/>
                            69
                        </Typography>
                    </div>
                    <div className='history__riders-list'>
                        {generateTable()}
                    </div>
                </Paper>
            </div>
        </>
    )
}

export default TeamHistory;