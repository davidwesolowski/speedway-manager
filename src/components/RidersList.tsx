import React, { FunctionComponent, useEffect, useState } from 'react';
import { FiX, FiXCircle, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import {
	Avatar,
	CircularProgress,
	Grid,
	IconButton,
	InputLabel,
	MenuItem,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField
} from '@material-ui/core';
import addNotification from '../utils/addNotification';
import getToken from '../utils/getToken';
import checkAdminRole from '../utils/checkAdminRole';
import { RouteProps, useHistory } from 'react-router-dom';
import { useStateValue } from './AppProvider';
import { checkBadAuthorization } from '../utils/checkCookies';
import { CSSTransition } from 'react-transition-group';

interface ISelect {
	nationality: string;
	age: string;
}

const RidersList: FunctionComponent<RouteProps> = () => {
	const { setLoggedIn, userData } = useStateValue();
	const { push } = useHistory();

	const [clubs, setClubs] = useState([]);
	const [riders, setRiders] = useState([]);
	const [loading, setLoading] = useState(true);
	const isAdmin = checkAdminRole(userData.role);
	const [filteredRiders, setFilteredRiders] = useState([]);

	const deleteRiders = async id => {
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
		}
	};

	const getClubs = async () => {
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
		setClubs([]);
		data.map(club => {
			setClubs(clubs =>
				clubs.concat({
					id: club._id,
					nazwa: club.name
				})
			);
		});
	};

	const getRiders = async () => {
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
		setRiders([]);
		data.map(rider => {
			setRiders(riders =>
				riders.concat({
					id: rider._id,
					imię: rider.firstName,
					nazwisko: rider.lastName,
					przydomek: rider.nickname || '-',
					data_urodzenia: rider.dateOfBirth,
					zagraniczny: rider.isForeigner,
					ksm: rider.KSM,
					klubId: rider.clubId,
					img: rider.image
				})
			);
		});
	};

	const ifForeigner = foreigner => {
		if (foreigner == true) {
			return <FiX className="NoX" />;
		} else {
			return <FiPlus className="YesPlus" />;
		}
	};

	const ifJunior = date => {
		if (new Date().getFullYear() - new Date(date).getFullYear() < 22) {
			return <FiPlus className="YesPlus"></FiPlus>;
		} else {
			return <FiX className="NoX"></FiX>;
		}
	};

	const findClubName = klubId => {
		if (clubs.find(club => club.id == klubId)) {
			return clubs.find(club => club.id == klubId).nazwa;
		} else {
			return '';
		}
	};

	const filtr = () => {
		if (selects.age == 'U23') {
			if (selects.nationality == 'All') {
				setFilteredRiders(
					riders.filter(
						rider =>
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() <
							24
					)
				);
			} else if (selects.nationality == 'Polish') {
				setFilteredRiders(
					riders.filter(
						rider =>
							rider.zagraniczny == false &&
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() <
								24
					)
				);
			} else {
				setFilteredRiders(
					riders.filter(
						rider =>
							rider.zagraniczny == true &&
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() <
								24
					)
				);
			}
		} else if (selects.age == 'U21') {
			if (selects.nationality == 'All') {
				setFilteredRiders(
					riders.filter(
						rider =>
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() <
							22
					)
				);
			} else if (selects.nationality == 'Polish') {
				setFilteredRiders(
					riders.filter(
						rider =>
							rider.zagraniczny == false &&
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() <
								22
					)
				);
			} else {
				setFilteredRiders(
					riders.filter(
						rider =>
							rider.zagraniczny == true &&
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() <
								22
					)
				);
			}
		} else if (selects.age == '22+') {
			if (selects.nationality == 'All') {
				setFilteredRiders(
					riders.filter(
						rider =>
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() >
							21
					)
				);
			} else if (selects.nationality == 'Polish') {
				setFilteredRiders(
					riders.filter(
						rider =>
							rider.zagraniczny == false &&
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() >
								21
					)
				);
			} else {
				setFilteredRiders(
					riders.filter(
						rider =>
							rider.zagraniczny == true &&
							new Date().getFullYear() -
								new Date(rider.data_urodzenia).getFullYear() >
								21
					)
				);
			}
		} else {
			if (selects.nationality == 'Polish') {
				setFilteredRiders(
					riders.filter(rider => rider.zagraniczny == false)
				);
			} else if (selects.nationality == 'All') {
				setFilteredRiders(riders);
			} else {
				setFilteredRiders(
					riders.filter(rider => rider.zagraniczny == true)
				);
			}
		}
	};

	const renderTableData = () => {
		if (
			phrase.length == 0 &&
			selects.age == 'All' &&
			selects.nationality == 'All'
		) {
			return riders.map(rider => {
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
					<TableRow key={id}>
						<TableCell>
							<Avatar src={rider.img} />
						</TableCell>
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
						<TableCell>{ifForeigner(zagraniczny)}</TableCell>
						<TableCell>{ifJunior(data_urodzenia)}</TableCell>
						<TableCell>{findClubName(klubId)}</TableCell>
						<TableCell>
							{isAdmin ? (
								<IconButton
									onClick={(
										event: React.MouseEvent<HTMLElement>
									) => {
										deleteRiders(id);
									}}
								>
									<FiXCircle />
								</IconButton>
							) : null}
						</TableCell>
					</TableRow>
				);
			});
		} else if (phrase.length == 0) {
			return filteredRiders.map(rider => {
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
					<TableRow key={id}>
						<TableCell>
							<Avatar src={rider.img} />
						</TableCell>
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
						<TableCell>{ifForeigner(zagraniczny)}</TableCell>
						<TableCell>{ifJunior(data_urodzenia)}</TableCell>
						<TableCell>{findClubName(klubId)}</TableCell>
						<TableCell>
							{isAdmin ? (
								<IconButton
									onClick={(
										event: React.MouseEvent<HTMLElement>
									) => {
										deleteRiders(id);
									}}
								>
									<FiXCircle />
								</IconButton>
							) : null}
						</TableCell>
					</TableRow>
				);
			});
		} else {
			return filteredRiders
				.filter(rider =>
					(
						rider.imię.toUpperCase() +
						' ' +
						rider.nazwisko.toUpperCase()
					).includes(phrase.toUpperCase())
				)
				.map(rider => {
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
						<TableRow key={id}>
							<TableCell>
								<Avatar src={rider.img} />
							</TableCell>
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
							<TableCell>{ifForeigner(zagraniczny)}</TableCell>
							<TableCell>{ifJunior(data_urodzenia)}</TableCell>
							<TableCell>{findClubName(klubId)}</TableCell>
							<TableCell>
								{isAdmin ? (
									<IconButton
										onClick={(
											event: React.MouseEvent<HTMLElement>
										) => {
											deleteRiders(id);
										}}
									>
										<FiXCircle />
									</IconButton>
								) : null}
							</TableCell>
						</TableRow>
					);
				});
		}
	};

	const renderTableHeader = () => {
		const header = [
			'',
			'Imię',
			'Nazwisko',
			'Przydomek',
			'Data urodzenia',
			'KSM',
			'Polak',
			'Junior',
			'Klub'
		];
		return header.map(name => {
			return (
				<TableCell key={name} align="center">
					{name.toUpperCase()}
				</TableCell>
			);
		});
	};

	const [phrase, setPhrase] = useState<string>('');
	const [selects, setSelects] = useState<ISelect>({
		nationality: 'All',
		age: 'All'
	});

	const handleOnChangePhrase = () => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			setPhrase(event.target.value);
		}
	};

	const handleOnChangeSelect = (name: string) => event => {
		event.persist();
		if (event.target) {
			setSelects((prevState: ISelect) => ({
				...prevState,
				[name]: event.target.value
			}));
		}
	};

	useEffect(() => {
		setLoading(true);
		(async function () {
			try {
				await getRiders();
				await getClubs();
			} catch (e) {
				const {
					response: { data }
				} = e;
				//upper component catching errors
			}
			setLoading(false);
		})();
	}, []);

	useEffect(() => {
		filtr();
	}, [phrase, selects.age, selects.nationality]);

	return (
		<>
			<div className="riders__search">
				<div className="riders__searchPhrase">
					<TextField
						label="Szukaj"
						value={phrase}
						onChange={handleOnChangePhrase()}
						className="ridersPhrase"
					/>
				</div>
				<div className="riders__searchSelect1">
					<InputLabel id="label1">Narodowość:</InputLabel>
					<Select
						labelId="label1"
						className="riders__select1"
						value={selects.nationality}
						onChange={handleOnChangeSelect('nationality')}
					>
						<MenuItem value="All">Wszyscy</MenuItem>
						<MenuItem value="Polish">Polacy</MenuItem>
						<MenuItem value="Foreigner">Obcokrajowcy</MenuItem>
					</Select>
				</div>
				<div className="riders__searchSelect2">
					<InputLabel id="label2">Wiek:</InputLabel>
					<Select
						labelId="label2"
						className="riders__select2"
						value={selects.age}
						onChange={handleOnChangeSelect('age')}
					>
						<MenuItem value="All">Wszyscy</MenuItem>
						<MenuItem value="U23">U23</MenuItem>
						<MenuItem value="U21">U21</MenuItem>
						<MenuItem value="22+">Seniorzy</MenuItem>
					</Select>
				</div>
			</div>
			<div className="riders-list-div">
				{loading && (
					<Grid container justify="center" alignItems="center">
						<CircularProgress />
					</Grid>
				)}
				{!loading && (
					<CSSTransition
						in={riders.length == 0}
						timeout={300}
						classNames="animationScaleUp"
						unmountOnExit
					>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>{renderTableHeader()}</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell colSpan={9}>
											Nie znaleziono zawodników w bazie!
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</CSSTransition>
				)}
				<CSSTransition
					in={riders.length > 0}
					timeout={300}
					classNames="animationScaleUp"
					unmountOnExit
				>
					<TableContainer>
						<Table id="riders-list">
							<TableHead>
								<TableRow>
									{renderTableHeader()}
									{isAdmin ? (
										<TableCell>USUŃ</TableCell>
									) : null}
								</TableRow>
							</TableHead>
							<TableBody>{renderTableData()}</TableBody>
						</Table>
					</TableContainer>
				</CSSTransition>
			</div>
		</>
	);
};

export default RidersList;
