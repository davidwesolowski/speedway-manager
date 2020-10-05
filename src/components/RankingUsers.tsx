import { Divider, MenuItem, Paper, Select, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { setUser } from '../actions/userActions';
import { checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';
import RankingUsersList from './RankingUsersList';

interface IRankingUser {
	_id: string;
	avatarUrl: string | null;
	name: string;
	teamLogo: string | null;
	teamName: string;
	points: number;
}

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
    const [owns, setOwns] = useState([]);
    const [participates, setParticipates] = useState([]);
    const [rankingUsers, setRankingUsers] = useState<IRankingUser[]>([]);

    const handleOnChangeSelect = () => event => {
        event.persist();
        if(event.target){
            setSelectedRanking(event.target.value);
            getRankingUsersList(event.target.value);
        }
    }

    const getUserRankings = async () => {
        //Do pobrania listy rankingów użytkownika + globalnego
        const accessToken = getToken();
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        try {
            const {
                data
            } = await axios.get(
                `https://fantasy-league-eti.herokuapp.com/rankings`,
                options
            );
            setOwns(data.owns);
            setParticipates(data.participates);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            }
        }
    }

    const generateOwnedRankingsSelect = () => {
        //Do wygenerowania MenuItems z pobranej listy rankingów użytkownika + globalnego
        if(owns){
            return owns.map((ranking, index) => {
                return (
                    <MenuItem key={ranking._id} value={ranking._id}>
                        {ranking.name}
                    </MenuItem>
                );
            });
        }
       
    }

    const generateParticipatedRankingsSelect = () => {
        if(participates){
            return participates.map((ranking, index) => {
                return (
                    <MenuItem key={ranking._id} value={ranking._id}>
                        {ranking.name}
                    </MenuItem>
                );
            });
        }
        
    }

    const getRankingUsersList = async (rankingId) => {
        //Do pobierania uzytkownikow umiejscowionych w rankingu
        //setRankingUsers()
        const accessToken = getToken();
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        try {
            const {
                data
            } = await axios.get(
                `https://fantasy-league-eti.herokuapp.com/rankings/${rankingId}`,
                options
            );
            setRankingUsers([]);
            data.scoreboard.map(user => {
                setRankingUsers(rankingUsers => 
                    rankingUsers.concat({
                        _id: user.userId,
                        avatarUrl: user.avatarUrl,
                        name: user.username,
                        teamLogo: user.teamLogoUrl,
                        teamName: user.teamName,
                        points: user.score
                    })
                );
            });
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            }
        }
    }

    const generateRankingTable = () => {
        //Do wygenerowania komponentu RankingUsersList na podstawie odpowiedniej listy userów
        //RankingUserList
        if(rankingUsers){
            return(
                <RankingUsersList
                    users={rankingUsers}
                />
            )
        }
    }

    useEffect(() => {
        if (!userData.username) fetchUserData();
        getUserRankings();
        getRankingUsersList('global');
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
                    <Select value={selectedRanking || 'global'} onChange={handleOnChangeSelect()}>
                        <MenuItem key='global' value='global'>Ranking globalny</MenuItem>
                        {generateOwnedRankingsSelect()}
                        {generateParticipatedRankingsSelect()}
                    </Select>
                    {generateRankingTable()}
                </Paper>
            </div>
        </>
    )
}

export default RankingUsers;