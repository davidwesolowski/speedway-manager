import { Divider, IconButton, Paper, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { FiXCircle } from 'react-icons/fi';
import { RouteComponentProps } from 'react-router-dom';
import { setUser } from '../actions/userActions';
import addNotification from '../utils/addNotification';
import { checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import { useStateValue } from './AppProvider';

const Leagues: FunctionComponent<RouteComponentProps> = ({history: { push }}) => {

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

    const [leagues, setLeagues] = useState([]);
    const [addLeagueName, setAddLeagueName] = useState<string>('');
    const [addLeagueCountry, setAddLeagueCountry] = useState<string>('');

    const [tempLeagues, setTempLeagues] = useState([
        {
            name: 'PGE Ekstraliga',
            country: "Polska"
        },
        {
            name: 'eWinner 1 liga żużlowa',
            country: 'Polska'
        },
        {
            name: '2 liga żużlowa',
            country: 'Polska'
        }
    ])

    const getLeagues = async () => {
        /*try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/leagues',
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

    const addLeague = async () => {
        /*try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/leagues',
                {
                    name: addLeagueName,
                    country: addLeagueCountry
                }
                options
            );
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
                    'Nie udało się pobrać dodać ligi do bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in adding league');
        }*/
    }

    const deleteLeague = async (id) => {
        /*try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/leagues/${id}`,
				options
			);
			addNotification(
				'Sukces!',
				'Udało się usunąć ligę!',
				'success',
				1000
			);
			setTimeout(() => {
				window.location.reload(false);
			}, 1000);
		} catch (e) {
			addNotification(
				'Błąd!',
				'Nie udało się usunąć ligi!',
				'danger',
				1000
			);
			console.log(e.response);
			throw new Error('Error in deleting league!');
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
                    <td>{league.country}</td>
                    <td className="table-X">
						<IconButton
							onClick={(event: React.MouseEvent<HTMLElement>) => {
								//deleteLeague(league._id);
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
                            <th>KRAJ</th>
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
            <div className="leagues">
                <div className="leagues__background"></div>
                <Paper className="leagues__box">
                    <Typography
                        variant="h2"
                        className="heading-1 leagues__heading"
                    >
                        Ligi
                    </Typography>
                    <Divider />
                    <br/>
                    {generateTable()}
                </Paper>
            </div>
        </>
    )
}

export default Leagues;