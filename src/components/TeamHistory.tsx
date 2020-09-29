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
    const [team, setTeam] = useState([]);
    const [historyResults, setHistoryResults] = useState([]);

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

    const getHistoryResults = async (teamId) => {
        try{
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const {data} = await axios.get(
                `https://fantasy-league-eti.herokuapp.com/teams/${teamId}/results`,
                options
            );

            setHistoryResults(data);
            getHistoryRiders(data, selectedRound);
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

    const getHistoryRiders = (results, round) => {
        if(results.find((result) => result.round._id === round)){
            setHistoryRiders((results.find((result) => result.round._id === round)).riders);
        } else {
            setHistoryRiders([])
        }
    }

    const getTeam = async () => {
        try{
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const {data} = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/teams',
                options
            );

            setTeam(data);
            getHistoryResults(data[0]._id);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
                addNotification(
                    'Błąd',
                    'Nie udało się pobrać drużyn z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in getting rounds');
        }
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
            getHistoryRiders(historyResults, event.target.value);
        }
    }

    const generateTable = () => {
        return(
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Imię</TableCell>
                            <TableCell>Nazwisko</TableCell>
                            <TableCell>KSM</TableCell>
                            {/* <TableCell>Klub</TableCell> */}
                            <TableCell>Wynik</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {historyRiders.map(rider => (
                            <TableRow key={rider.riderId} hover={true}>
                                <TableCell></TableCell>
                                <TableCell>{rider.firstName}</TableCell>
                                <TableCell>{rider.lastName}</TableCell>
                                <TableCell>{rider.KSM}</TableCell>
                                {/*<TableCell>{rider.club}</TableCell>*/}
                                <TableCell>{rider.score}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const postToUpdateAssigns = async () => {
        try{
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const {data} = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/rounds/resolve-current',
                options
            );
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

    const getTotalScore = () => {
        if(historyResults.find((result) => result.round._id === selectedRound)){
            return(
                <Typography variant='h1' className='history__full-score-text'>
                    Łączny wynik:
                    <br/>
                    {historyResults.find((result) => result.round._id === selectedRound).score}
                </Typography>)
        } else {
            return('')
        }
    }

    useEffect(() => {
        if (!userData.username) fetchUserData();
        getRounds();
        getTeam();
        //postToUpdateAssigns();
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
                        {getTotalScore()}
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