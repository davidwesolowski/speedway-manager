import { Divider, MenuItem, Paper, Select, Typography } from '@material-ui/core';
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

    useEffect(() => {
        if (!userData.username) fetchUserData();
        getRounds();
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
                    <div className='history__riders-list'>

                    </div>
                    <div className='history__full-score'>
                        <Typography variant='h1' className='history__full-score-text'>
                            69
                        </Typography>
                    </div>
                </Paper>
            </div>
        </>
    )
}

export default TeamHistory;