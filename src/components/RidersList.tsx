import React, { Component, FunctionComponent, useEffect, useState } from 'react';
import { FiX, FiXCircle, FiPlus } from 'react-icons/fi';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import addNotification from '../utils/addNotification';
import getToken from '../utils/getToken';
import checkAdminRole from '../utils/checkAdminRole';
import { RouteComponentProps, RouteProps, useHistory } from 'react-router-dom';
import { useStateValue } from './AppProvider';
import { checkBadAuthorization } from '../utils/checkCookies';

const RidersList : FunctionComponent<RouteProps> = () => {

	const {
        setLoggedIn,
		dispatchUserData,
		userData,
	} = useStateValue();
	const { push } = useHistory();


	const [clubs, setClubs] = useState([]);
	const [riders, setRiders] = useState([]);
	const isAdmin = checkAdminRole(userData.role);


	const deleteRiders = async (id) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/riders/${id}`,
				options
			);
			////Sukces
			addNotification(
				'Sukces!',
				'Udało się usunąć zawodnika!',
				'success',
				1000
			);
			setTimeout(() => {
				window.location.reload(false);
			}, 1000);
		} catch (e) {
			const {
                response: { data }
            } = e;
			if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
				addNotification(
					'Błąd!',
					'Nie udało się usunąć zawodnika!',
					'danger',
					1000
				);
			}
			console.log(e.response);
			throw new Error('Error in deleting riders!');
		}
	}

	const getClubs = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/clubs',
				options
			);
			setClubs([])
			data.map(club => {
				setClubs(clubs =>
					clubs.concat({
						id: club._id,
						nazwa: club.name
					})
				)
			});
		} catch (e) {
			const {
                response: { data }
            } = e;
			if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
				addNotification(
					'Błąd!',
					'Nie udało się usunąć zawodnika!',
					'danger',
					1000
				);
			}
			console.log(e.response);
			throw new Error('Error in deleting riders!');
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
			console.log(data)
			setRiders([]);
			data.map(rider => {
				setRiders(riders =>
					riders.concat({
						id: rider._id,
						imię: rider.firstName,
						nazwisko: rider.lastName,
						przydomek: rider.nickname,
						data_urodzenia: rider.dateOfBirth,
						zagraniczny: rider.isForeigner,
						ksm: rider.KSM,
						klubId: rider.clubId
					})
				);
			});
		} catch (e) {
			const {
                response: { data }
            } = e;
			if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
				addNotification(
					'Błąd!',
					'Nie udało się usunąć zawodnika!',
					'danger',
					1000
				);
			}
			console.log(e.response);
			throw new Error('Error in deleting riders!');
		}
	}

	const ifForeigner = (foreigner) => {
		if (foreigner.zagraniczny == true) {
			return <FiX className="NoX"></FiX>;
		} else {
			return <FiPlus className="YesPlus"></FiPlus>;
		}
	}

	const ifJunior = (date) => {
		if (
			new Date().getFullYear() -
				new Date(date.data_urodzenia).getFullYear() <
			22
		) {
			return <FiPlus className="YesPlus"></FiPlus>;
		} else {
			return <FiX className="NoX"></FiX>;
		}
	}

	const getClubName = (klubId) => {
		if(clubs.find(club => club.id == klubId))
		{
			return(clubs.find(club => club.id == klubId).nazwa)
		}
		else
		{
			return('')
		}
	}

	const renderTableData = () => {
		return riders.map((rider, index) => {
			const {
				id,
				imię,
				nazwisko,
				przydomek,
				data_urodzenia,
				zagraniczny,
				ksm,
				klubId
			} = rider;
			return (
				<TableRow
					key={id}
				>
					<TableCell>{imię}</TableCell>
					<TableCell>{nazwisko}</TableCell>
					<TableCell>{przydomek}</TableCell>
					<TableCell>
						{new Intl.DateTimeFormat('en-GB', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit'
						}).format(new Date(data_urodzenia))}
					</TableCell>
					<TableCell>{ksm}</TableCell>
					<TableCell>{ifForeigner({ zagraniczny })}</TableCell>
					<TableCell>{ifJunior({ data_urodzenia })}</TableCell>
					<TableCell>{getClubName(klubId)}</TableCell>
					<TableCell className="table-X">
						<IconButton
							onClick={(event: React.MouseEvent<HTMLElement>) => {
								deleteRiders(id);
							}}
							className="delete-button"
						>
							<FiXCircle />
						</IconButton>
					</TableCell>
				</TableRow>
			);
		});
	}

	const renderTableHeader = () => {
		let header = [
			'Imię',
			'Nazwisko',
			'Przydomek',
			'Data urodzenia',
			'KSM',
			'Polak',
			'Junior',
			'Klub'
		];
		return header.map((key, index) => {
			return <TableCell key={index}>{key.toUpperCase()}</TableCell>;
		});
	}

	useEffect(() => {
		getRiders();
		getClubs();
	}, [])

	return(
		<div className='riders-list-div'>
			<TableContainer>
				<Table id='riders-list'>
					<TableHead>
						<TableRow>
							{renderTableHeader()}
							{isAdmin ? <TableCell>USUŃ</TableCell> : null}
						</TableRow>
					</TableHead>
					<TableBody>
						{renderTableData()}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	)
}

export default RidersList;
