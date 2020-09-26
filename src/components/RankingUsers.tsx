import { Divider, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setUser } from '../actions/userActions';
import { checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';

const RankingUsers : FunctionComponent<RouteComponentProps> = ({history: {push}}) => {
    
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

    const [selectedRanking, setSelectedRanking] = useState<string>('');

    useEffect(() => {
        if (!userData.username) fetchUserData();
    }, [])

    return(
        <>
            <div className="rankingUsers">
                <div className="rankingUsers__background"></div>
                <Paper className="rankingUsers__box">
                    <Typography
                        variant="h2"
                        className="heading-1 rankingUsers__heading"
                    >
                        Ranking
                    </Typography>
                    <Divider />
                    <br/>
                </Paper>
            </div>
        </>
    )
}

export default RankingUsers;