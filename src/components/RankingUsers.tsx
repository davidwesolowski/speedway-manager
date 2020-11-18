import { CircularProgress, Divider, Grid, MenuItem, Paper, Select, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import addNotification from '../utils/addNotification';
import { checkBadAuthorization } from '../utils/checkCookies';
import fetchUserData from '../utils/fetchUserData';
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

    const [selectedRanking, setSelectedRanking] = useState<string>('');
    const [owns, setOwns] = useState([]);
    const [participates, setParticipates] = useState([]);
    const [rankingUsers, setRankingUsers] = useState<IRankingUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleOnChangeSelect = () => event => {
        event.persist();
        if(event.target){
            setLoading(true);
            setSelectedRanking(event.target.value);
            getRankingUsersList(event.target.value);
            setLoading(false);
        }
    }

    const getUserRankings = async () => {
        const accessToken = getToken();
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
            const {
                data
            } = await axios.get(
                `https://fantasy-league-eti.herokuapp.com/rankings`,
                options
            );
            setOwns(data.owns);
            setParticipates(data.participates);
    }

    const generateOwnedRankingsSelect = () => {
        if(owns){
            return owns.map((ranking) => {
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
            return participates.map((ranking) => {
                return (
                    <MenuItem key={ranking._id} value={ranking._id}>
                        {ranking.name}
                    </MenuItem>
                );
            });
        }
        
    }

    const getRankingUsersList = async (rankingId) => {
        const accessToken = getToken();
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
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
                        _id: user.userid,
                        avatarUrl: user.avatarUrl,
                        name: user.username,
                        teamLogo: user.teamlogourl,
                        teamName: user.teamname,
                        points: user.score ? parseInt(user.score) : 0
                    })
                );
            });
    }

    const generateRankingTable = () => {
        if(rankingUsers){
            return(
                <RankingUsersList
                    users={rankingUsers}
                />
            )
        }
    }

    useEffect(() => {
        setLoading(true);
        (async function () {
            try {
                await getUserRankings();
                await getRankingUsersList('global');
                if (!userData.username) await fetchUserData(dispatchUserData, setLoggedIn, push);
            } catch (e) {
                const {
                    response: { data }
                } = e;
                if (data.statusCode == 401) {
                    checkBadAuthorization(setLoggedIn, push);
                } else {
                    addNotification('Błąd!', 'Nie udało się pobrać danych z bazy', 'danger', 1500);
                }
            }
            setLoading(false);
        })();
        setTimeout(() => {
            document.body.style.overflow = 'auto';
        }, 200);
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
                    {loading && (
                        <Grid container justify="center" alignItems="center">
                            <CircularProgress />
                        </Grid>
                    )}
                    <CSSTransition
                        in={rankingUsers.length > 0}
                        timeout={300}
                        classNames="animationScaleUp"
                        unmountOnExit
                    >
                        {generateRankingTable()}
                    </CSSTransition>
                </Paper>
            </div>
        </>
    )
}

export default RankingUsers;