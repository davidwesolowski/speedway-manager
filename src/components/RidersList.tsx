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
import { useHistory } from 'react-router-dom';
import { useStateValue } from './AppProvider';
import { checkBadAuthorization, checkCookies } from '../utils/checkCookies';
import { CSSTransition } from 'react-transition-group';
import fetchUserData from '../utils/fetchUserData';
import RemoveDialog from './RemoveDialog';

interface ISelect {
	nationality: string;
	age: string;
}

interface IProps {
	riders: IRiderPass[];
	deleteRider: (id: string) => Promise<void>;
	numberOfRiders: number;
}

interface IRiderPass {
	id: string;
	imię: string;
	nazwisko: string;
	przydomek: string;
	data_urodzenia: Date;
	zagraniczny: boolean;
	ksm: number;
	klubId: string;
	image: string;
}

const defaultRider: IRiderPass = {
	id: '',
	imię: '',
	nazwisko: '',
	przydomek: '',
	data_urodzenia: new Date(),
	zagraniczny: false,
	ksm: -1,
	klubId: '',
	image: ''
};

const RidersList: FunctionComponent<IProps> = ({ riders, deleteRider, numberOfRiders}) => {
	const { setLoggedIn, dispatchUserData, userData } = useStateValue();
	const { push } = useHistory();

	const [clubs, setClubs] = useState([]);
	const isAdmin = checkAdminRole(userData.role) && checkCookies();
	const [filteredRiders, setFilteredRiders] = useState([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [firstUsage, setFirstUsage] = useState<boolean>(true);
	const [removeDialog, setRemoveDialog] = useState(false);
	const [rider, setRider] = useState<IRiderPass>(defaultRider);

	const handleRemoveOpen = (rider: IRiderPass) => () => {
		setRemoveDialog(true);
		setRider(rider);
	};
	const handleRemoveClose = () => {
		setRemoveDialog(false);
		setRider(defaultRider);
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

	const checkIfFilteredRidersExist = () => {
		if (
			!firstUsage &&
			phrase.length == 0 &&
			selects.age == 'All' &&
			selects.nationality == 'All' &&
			riders.length == 0
		) {
			return false;
		} else if (
			!firstUsage &&
			phrase.length == 0 &&
			filteredRiders.length == 0
		) {
			return false;
		} else if (
			!firstUsage &&
			filteredRiders.filter(rider =>
				(
					rider.imię.toUpperCase() +
					' ' +
					rider.nazwisko.toUpperCase()
				).includes(phrase.toUpperCase())
			).length == 0
		) {
			return false;
		} else {
			return true;
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
					klubId,
					image
				} = rider;
				return (
					<TableRow key={id}>
						<TableCell>
							<Avatar src={image} alt="rider-avatar" />
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
						{isAdmin && (
							<TableCell><IconButton
								className="riders-list__delete-rider-button"
								onClick={handleRemoveOpen(rider)}
							>
								<FiXCircle />
							</IconButton></TableCell>
						)}
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
					klubId,
					image
				} = rider;
				return (
					<TableRow key={id}>
						<TableCell>
							<Avatar src={image} alt="rider-avatar" />
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
						{isAdmin ? (
							<TableCell><IconButton
								className="riders-list__delete-rider-button"
								onClick={handleRemoveOpen(rider)}
							>
								<FiXCircle />
							</IconButton></TableCell>
						) : null}
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
						klubId,
						image
					} = rider;
					return (
						<TableRow key={id}>
							<TableCell>
								<Avatar src={image} alt="rider-avatar" />
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
							{isAdmin ? (
								<TableCell><IconButton
									className="riders-list__delete-rider-button"
									onClick={handleRemoveOpen(rider)}
								>
									<FiXCircle />
								</IconButton></TableCell>
							) : null}
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
		if (!loading && checkIfFilteredRidersExist()) {
			return header.map(name => {
				return (
					<TableCell key={name} align="center">
						{name.toUpperCase()}
					</TableCell>
				);
			});
		}
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
			setFirstUsage(false);
			setPhrase(event.target.value);
		}
	};

	const handleOnChangeSelect = (name: string) => event => {
		event.persist();
		if (event.target) {
			setFirstUsage(false);
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
				await getClubs();
				if (!userData.username)
					await fetchUserData(dispatchUserData, setLoggedIn, push);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					addNotification(
						'Błąd!',
						'Nie udało się pobrać danych z bazy',
						'danger',
						1500
					);
				}
			}
			setLoading(false);
		})();
	}, []);

	useEffect(() => {
		filtr();
	}, [phrase, selects.age, selects.nationality]);

	return (
		<>
			<div className="find-rider__search">
				<div className="find-rider__search-phrase">
					<TextField
						label="Szukaj"
						value={phrase}
						onChange={handleOnChangePhrase()}
						className="find-rider__phrase"
					/>
				</div>
				<div className="find-rider__search-select1">
					<InputLabel id="label1">Narodowość:</InputLabel>
					<Select
						labelId="label1"
						className="find-rider__select1"
						value={selects.nationality}
						onChange={handleOnChangeSelect('nationality')}
					>
						<MenuItem value="All">Wszyscy</MenuItem>
						<MenuItem value="Polish">Polacy</MenuItem>
						<MenuItem value="Foreigner">Obcokrajowcy</MenuItem>
					</Select>
				</div>
				<div className="find-rider__search-select2">
					<InputLabel id="label2">Wiek:</InputLabel>
					<Select
						labelId="label2"
						className="find-rider__select2"
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
				{loading || riders.length < numberOfRiders ? (
					<Grid container justify="center" alignItems="center">
						<CircularProgress />
					</Grid>
				) : null}
				<CSSTransition
				in={riders.length == numberOfRiders}
				timeout={300}
				classNames="animationScaleUp"
				unmountOnExit
			>
				<TableContainer>
					<Table id="riders-list">
						<TableHead>
							<TableRow>
								{renderTableHeader()}
								{checkIfFilteredRidersExist() ? 
								(isAdmin ?
									(<TableCell>USUŃ</TableCell>) :
									null) : (
										<TableCell>
											BRAK ZAWODNIKÓW SPEŁNIAJĄCYCH
											WYBRANE KRYTERIA
										</TableCell>
									)}
							</TableRow>
						</TableHead>
						<TableBody>{renderTableData()}</TableBody>
					</Table>
				</TableContainer>
			</CSSTransition>
			</div>
			<RemoveDialog
				removeDialog={removeDialog}
				handleRemoveClose={handleRemoveClose}
				removeFunction={async () => deleteRider(rider.id)}
				title="Czy chcesz usunąć zawodnika?"
			/>
		</>
	);
};

export default RidersList;
