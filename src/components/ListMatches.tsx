import React, { FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Paper, Typography, Divider, MenuItem, InputLabel, Select } from '@material-ui/core';
import { useStateValue } from './AppProvider';
import getToken from '../utils/getToken';
import axios from 'axios';
import { setUser } from '../actions/userActions';
import addNotification from '../utils/addNotification';
import ListMatchesRound from './ListMatchesRound';
import { checkBadAuthorization } from '../utils/checkCookies';

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

const ListMatches: FunctionComponent<RouteComponentProps> = ({history: { push }}) => {

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

    const [rounds, setRounds] = useState([])
    const [riders, setRiders] = useState<IRider[]>([])

    const generateRounds = () => {
        return rounds.map((round, index) => {
            return <MenuItem key={index} value={round._id}>Runda {round.number}</MenuItem>
        })
    }

    const getRounds = async () => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/rounds',
                options
            );
            setRounds([]);
            setRounds(data);
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

    const getRiders = async () => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/riders',
                options
            );

            setRiders(data);
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
                    'Nie udało się pobrać zawodników z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in getting riders');
        }
    }

    const [roundId, setRoundId] = useState<string>('')
    const [number, setNumber] = useState<number>(0)
    const [startDate, setStartDate] = useState<Date>(new Date())
    const [endDate, setEndDate] = useState<Date>(new Date())

    const handleOnChangeSelectRound = () => (
        event
    ) => {
        event.persist();
        if(event.target) {
            setRoundId(event.target.value);
            if(event.target.value !== 'all'){
                setNumber(rounds.find((round) => round._id === event.target.value).number)
                setStartDate(rounds.find((round) => round._id === event.target.value).startDate)
                setEndDate(rounds.find((round) => round._id === event.target.value).endDate)
            }
        };
    }

    const generateMatches = () => {
        if(roundId === 'all'){
            return rounds.map((round, index) => {
                return(
                    <ListMatchesRound
                        key={index}
                        round={round.number}
                        roundId={round._id}
                        startDate={round.startDate.toString()}
                        endDate={round.endDate.toString()}
                        riders={riders}
                    />
                )
            })
        } else if(roundId !== ''){
            return(
                <ListMatchesRound
                    key={roundId}
                    round={number}
                    roundId={roundId}
                    startDate={startDate.toString()}
                    endDate={endDate.toString()}
                    riders={riders}
                />
            )
        }
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 3000)
    }

    useEffect(() => {
        getRounds();
        if (!userData.username) fetchUserData();
        getRiders();
    }, [])



    return(
        <>
            <div className="list-matches">
                <div className="list-matches__background"></div>
                <Paper className="list-matches__box">
                    <Typography
                        variant="h2"
                        className="heading-1 list-matches__heading"
                    >
                        Rozegrane mecze
                    </Typography>
                    <Divider />
                    <br/>
                    <div className="list-matches__round-div">
                        <InputLabel id="roundLabel">Kolejka:</InputLabel>
                        <Select labelId="roundLabel" className="add-match__round-select" value={roundId || ''} onChange={handleOnChangeSelectRound()}>
                            <MenuItem key="0000" value="all">Wszystkie</MenuItem>
                            {generateRounds()}
                        </Select>
                    </div>
                    {generateMatches()}
                </Paper>
            </div>
        </>
    )
}

export default ListMatches;