import React, {
	FunctionComponent,
	useState,
	useContext,
	ChangeEvent,
	FormEvent,
	SetStateAction,
	Dispatch
} from 'react';
import {
	Typography,
	Grid,
	TableContainer,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	IconButton,
	Dialog,
	DialogTitle,
	DialogContent,
	FormGroup,
	TextField,
	Button,
	DialogActions
} from '@material-ui/core';
import { FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import handleImgFile, {
	IImageData,
	defaultImageData
} from '../utils/handleImgFile';
import Cookies from 'universal-cookie';
import axios from 'axios';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';
import { AppContext } from './AppProvider';
import { checkBadAuthorization } from '../validation/checkCookies';
import { IRider } from './Team';

const riders = [
	{
		_id: '1',
		firstName: 'Krzysztof',
		lastName: 'Buczkowski',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 3.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '2',
		firstName: 'Artem',
		lastName: 'Łaguta',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 12.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '3',
		firstName: 'Nicki',
		lastName: 'Pedersen',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 8.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '4',
		firstName: 'Kenneth',
		lastName: 'Bjerre',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 8.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '5',
		firstName: 'Bartosz',
		lastName: 'Zmarzlik',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 11.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '6',
		firstName: 'Szymon',
		lastName: 'Woźniak',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 2.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '7',
		firstName: 'Maciej',
		lastName: 'Janowski',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 9.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '8',
		firstName: 'Bartosz',
		lastName: 'Smektała',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 8.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '9',
		firstName: 'Dominik',
		lastName: 'Kubera',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 7.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '10',
		firstName: 'Emil',
		lastName: 'Sajfutdinow',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 12.0,
		dateOfBirth: '06.08.2020'
	}
];

interface IProps {
	team: { name: string; logo_url: string; _id: string };
	riders: IRider[];
	updatedTeam: boolean;
	setUpdatedTeam: Dispatch<SetStateAction<boolean>>;
}

const displayDate = (date: string): string => {
	const newDate = new Date(date);
	const year = newDate.getFullYear();
	const month =
		newDate.getMonth() < 9
			? `0${newDate.getMonth() + 1}`
			: newDate.getMonth() + 1;
	const day = newDate.getDate();
	return `${day}.${month}.${year}`;
};

const TeamGeneral: FunctionComponent<IProps> = ({
	team,
	riders,
	setUpdatedTeam,
	updatedTeam
}) => {
	const [editOpen, setEditOpen] = useState<boolean>(false);
	const [removeOpen, setRemoveOpen] = useState<boolean>(false);
	const [teamName, setTeamName] = useState<string>('');
	const [imageData, setImageData] = useState<IImageData>(defaultImageData);
	const { push } = useHistory();
	const { setLoggedIn } = useContext(AppContext);

	const handleEditClose = () => {
		setTeamName('');
		setEditOpen(false);
		setImageData(defaultImageData);
	};

	const handleEditOpen = () => setEditOpen(true);

	const handleRemoveOpen = () => setRemoveOpen(true);

	const handleRemoveClose = () => setRemoveOpen(false);

	const handleOnchange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target) {
			setTeamName(event.target.value);
		}
	};

	const editTeam = async () => {
		try {
			const cookies = new Cookies();
			const access_token = cookies.get('access_token');
			const options = {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			};
			const title = 'Sukces!';
			let message = '';
			const type = 'success';
			const duration = 3000;

			if (teamName && teamName !== name) {
				await axios.patch(
					`https://fantasy-league-eti.herokuapp.com/teams/${team._id}`,
					{ name: teamName },
					options
				);
				message = 'Pomyślna zmiana nazwy drużyny!';
				addNotification(title, message, type, duration);
			}
			const { name: filename, imageBuffer } = imageData;
			if (filename && imageBuffer) {
				const {
					data: { signed_url, type: content_type }
				} = await axios.post(
					`https://fantasy-league-eti.herokuapp.com/teams/${team._id}/logo`,
					{ filename },
					options
				);

				const awsOptions = {
					headers: {
						'Content-Type': content_type
					}
				};
				await axios.put(signed_url, imageBuffer, awsOptions);
				message = 'Pomyślna zmiana loga drużyny!';
				addNotification(title, message, type, duration);
			}
			setUpdatedTeam(!updatedTeam);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd!';
				const message = 'Błąd podczas edycji danych!';
				const type = 'danger';
				const duration = 3000;
				addNotification(title, message, type, duration);
			}
		}
	};

	const removeTeam = async () => {
		try {
			const cookies = new Cookies();
			const access_token = cookies.get('access_token');
			const options = {
				headers: {
					Authorization: `Bearer ${access_token}`
				}
			};
			await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/teams/${team._id}`,
				options
			);
			const title = 'Sukces!';
			const message = 'Pomyślnie usunięto drużynę!';
			const type = 'success';
			const duration = 1500;
			addNotification(title, message, type, duration);
			setTimeout(() => {
				handleRemoveClose();
				setUpdatedTeam(!updatedTeam);
			}, duration);
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd!';
				const message = 'Wystąpił błąd podczas usuwania drużyny!';
				const type = 'danger';
				const duration = 1500;
				addNotification(title, message, type, duration);
			}
		}
	};

	const handleOnSubmit = (event: FormEvent) => {
		event.preventDefault();
		editTeam();
	};

	return (
		<>
			<Grid container alignItems="flex-start" className="team-container">
				<Grid item xs={1}>
					<IconButton onClick={handleEditOpen}>
						<FaPencilAlt />
					</IconButton>
					<IconButton onClick={handleRemoveOpen}>
						<FaTrashAlt />
					</IconButton>
				</Grid>
				<Grid item xs={11} md={3}>
					<div className="team-container__left-pane">
						<Typography className="heading-1 team-container__name">
							{team.name}
						</Typography>
						<div className="team-container__logo-box">
							<img
								src={team.logo_url}
								alt="team-logo"
								className="team-container__logo"
							/>
						</div>
					</div>
				</Grid>
				<Grid item xs={12} md={8}>
					<div className="team-container__right-pane">
						<Typography className="heading-2 team-container__name">
							Kadra:
						</Typography>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Imię</TableCell>
										<TableCell>Nazwisko</TableCell>
										<TableCell>Data urodzenia</TableCell>
										<TableCell>Klub</TableCell>
										<TableCell>KSM</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{riders.map(rider => (
										<TableRow key={rider._id} hover={true}>
											<TableCell>
												{rider.firstName}
											</TableCell>
											<TableCell>
												{rider.lastName}
											</TableCell>
											<TableCell>
												{displayDate(rider.dateOfBirth)}
											</TableCell>
											<TableCell>{rider.club}</TableCell>
											<TableCell>{rider.ksm}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					</div>
				</Grid>
			</Grid>
			<Dialog
				open={editOpen}
				className="dialog"
				onClose={handleEditClose}
			>
				<DialogTitle>
					<div className="dialog__header">
						<Typography variant="h4" className="dialog__title">
							Edycja drużyny
						</Typography>
						<IconButton onClick={handleEditClose}>
							<FiX />
						</IconButton>
					</div>
				</DialogTitle>
				<DialogContent dividers>
					<form
						className="dialog__form"
						encType="multipart/form-data"
						onSubmit={handleOnSubmit}
					>
						<Grid container alignItems="center">
							<Grid item xs={1}></Grid>
							<Grid item xs={5}>
								<FormGroup>
									<TextField
										label="Nazwa"
										value={teamName}
										onChange={handleOnchange}
									/>
								</FormGroup>
							</Grid>
							<Grid item xs={6}>
								<input
									type="file"
									style={{ display: 'none' }}
									accept="image/*"
									id="id-file"
									onChange={handleImgFile(setImageData)}
								/>
								<label htmlFor="id-file">
									<div className="dialog__avatar-img-box">
										<img
											src={
												imageData.imageUrl
													? (imageData.imageUrl as string)
													: team.logo_url
											}
											alt="team-logo"
											className="dialog__avatar-img"
										/>
										<div className="dialog__avatar-edit">
											Edytuj
										</div>
									</div>
								</label>
							</Grid>
							<Grid item xs={1}></Grid>
							<Grid item xs={10}>
								<Button
									className="btn dialog__form_button"
									type="submit"
								>
									Edytuj
								</Button>
							</Grid>
							<Grid item xs={1}></Grid>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
			<Dialog open={removeOpen} onClose={handleRemoveClose}>
				<DialogTitle>
					<div>
						<Typography variant="h4" className="dialog__title">
							Czy na pewno chcesz usunąć swoją drużynę?
						</Typography>
					</div>
				</DialogTitle>
				<DialogActions>
					<Button className="btn" onClick={handleRemoveClose}>
						Anuluj
					</Button>
					<Button
						className="btn dialog__button-approve"
						onClick={removeTeam}
					>
						Usuń
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default TeamGeneral;
