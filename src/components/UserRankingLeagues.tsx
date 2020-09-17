import { Divider, IconButton, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect } from 'react';
import { FiPlus } from 'react-icons/fi';
import { RouteComponentProps } from 'react-router-dom';
import { setUser } from '../actions/userActions';
import { checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';

interface IValidationData{
    name: {
        message: string;
        error: string;
    };
    mainLeague: {
        message: string;
        error: string;
    }
}

const UserRankingLeagues: FunctionComponent<RouteComponentProps> = ({history: { push }}) => {

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

    useEffect(() => {
        if (!userData.username) fetchUserData();
    }, [])

    return(
        <>
            <div className="user-leagues">
                <div className="user-leagues__background"></div>
                <Paper className="user-leagues__box">
                    <Typography
                        variant="h2"
                        className="heading-1 user-leagues__heading"
                    >
                        Moje Ligi
                    </Typography>
                    <IconButton
                        //onClick={handleOpenDialog}
                        className="user-leagues__fiplus"
                    >
                        <FiPlus />
                    </IconButton>
                    <Divider />
                    <br/>
                </Paper>
            </div>
        </>
    )
}

export default UserRankingLeagues;