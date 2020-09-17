import { Divider, IconButton, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { FiPlus, FiXCircle } from 'react-icons/fi';
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

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [addUserLeagueName, setAddUserLeagueName] = useState<string>('');
    const [leagues, setLeagues] = useState([]);
    const [addUserLeagueMainLeague, setAddUserLeagueMainLeague] = useState<string>('');

    const [tempLeagues, setTempLeagues] = useState([
        {name: "Liga 1", mainLeague: "Glowna 1", owner: "Wlasciciel 1"},
        {name: "Liga 2", mainLeague: "Glowna 2", owner: "Wlasciciel 2"},
        {name: "Liga 3", mainLeague: "Glowna 3", owner: "Wlasciciel 3"}
    ])

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAddUserLeagueName('');
        setAddUserLeagueMainLeague('');
    }

    //Jedna lub dwie funkcje w zaleznosci od backendu
    const getUserLeagues = async () => {
        /*try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/user-leagues',
                options
            );

            setLeagues(data);
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
                    'Nie udało się pobrać lig z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in getting leagues');
        }*/
    }

    const addUserLeague = async () => {
        /*try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/user-leagues',
                {DANE},
                options
            );

            setLeagues(data);
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
                    'Nie udało się pobrać lig z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in getting leagues');
        }*/
    }

    const renderTableData = () => {
        return tempLeagues.map((league, index) => {
            return(
                <tr
					key={index}
					style={
						index % 2
							? { background: 'white' }
							: { background: '#dddddd' }
					}
				>
                    <td>{league.name}</td>
                    <td>{league.mainLeague}</td>
                    <td className="table-X">
						<IconButton
							onClick={(event: React.MouseEvent<HTMLElement>) => {
								//usun dzialajacy jesli moja liga
							}}
							className="delete-button"
						>
							<FiXCircle />
						</IconButton>
					</td>
                </tr>
            )
        })
    }

    const generateTable = () => {
        return(
            <div>
                <table id="riders-list">
                    <tbody>
                        <tr>
                            <th>NAZWA</th>
                            <th>GŁÓWNA LIGA</th>
                            <th>USUŃ</th>
                        </tr>
                        {renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }

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
                        onClick={handleOpenDialog}
                        className="user-leagues__fiplus"
                    >
                        <FiPlus />
                    </IconButton>
                    <Divider />
                    <br/>
                    {generateTable()}
                </Paper>
            </div>
        </>
    )
}

export default UserRankingLeagues;