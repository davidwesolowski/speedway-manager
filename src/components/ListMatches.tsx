import React, { FunctionComponent, useEffect, useState } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Paper, Typography, Divider, MenuItem } from '@material-ui/core';
import { useStateValue } from './AppProvider';
import getToken from '../utils/getToken';
import axios from 'axios';
import { setUser } from '../actions/userActions';
import addNotification from '../utils/addNotification';

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
            /*const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            }*/
        }
    };

    const [rounds, setRounds] = useState([])

    const generateRounds = () => {
        return rounds.map((round, index) => {
            return <MenuItem key={index} value={round.number.toString()}>Runda {round.number}</MenuItem>
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
            /*data.map((round, index) => {
                setRounds(
                    rounds.concat({
                        startDate: round.startDate,
                        endDate: round.endDate,
                        number: round.number
                    })
                );
            });*/
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

    useEffect(() => {
        getRounds();
        if (!userData.username) fetchUserData();
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
                </Paper>
            </div>
        </>
    )
}

export default ListMatches;