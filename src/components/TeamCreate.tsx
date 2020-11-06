import React, {
	FunctionComponent,
	useState,
	ChangeEvent,
	FormEvent,
	useContext,
	SetStateAction,
	Dispatch,
	useEffect
} from 'react';
import {
	Typography,
	FormControl,
	Grid,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	Button
} from '@material-ui/core';
import { FaFileUpload } from 'react-icons/fa';
import axios from 'axios';
import handleImgFile, {
	IImageData,
	defaultImageData
} from '../utils/handleImgFile';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';
import { checkBadAuthorization } from '../utils/checkCookies';
import { AppContext } from './AppProvider';
import getToken from '../utils/getToken';
import { ILeague } from './Team';
import { IClub } from './ClubLeagueCreate';

interface ITeamState {
	name: string;
	leagueName: string;
	_id?: string;
	imageUrl?: string;
}

interface IProps {
	updatedTeam: boolean;
	setUpdatedTeam: Dispatch<SetStateAction<boolean>>;
	url: string;
	leagues: ILeague[];
	isClub?: boolean;
	editClubData?: ITeamState;
	setEditClubData?: Dispatch<SetStateAction<IClub>>;
}

type SelectType = {
	name?: string | undefined;
	value: unknown;
};

const defaultTeam: ITeamState = {
	name: '',
	leagueName: ''
};

const TeamCreate: FunctionComponent<IProps> = ({
	updatedTeam,
	setUpdatedTeam,
	url,
	leagues,
	isClub,
	editClubData,
	setEditClubData
}) => {
	const [team, setTeam] = useState<ITeamState>(defaultTeam);
	const [imageData, setImageData] = useState<IImageData>(defaultImageData);
	const { setLoggedIn } = useContext(AppContext);
	const { push } = useHistory();

	const handleOnChange = (name: string) => (
		event: ChangeEvent<HTMLInputElement | SelectType>
	) => {
		event.persist();
		if (event.target) {
			setTeam((prevState: ITeamState) => ({
				...prevState,
				[name]: event.target.value
			}));
		}
	};

	const createTeam = async (team: ITeamState, imageData: IImageData) => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			let _id;
			if (isClub) {
				const leagueId = leagues.find(
					league => league.name === team.leagueName
				)._id;
				const { data } = await axios.post(
					url,
					{
						name: team.name,
						leagueId
					},
					options
				);
				_id = data._id;
			} else {
				const { data } = await axios.post(
					url,
					{ name: team.name },
					options
				);
				_id = data._id;
			}
			const typeNotification = 'success';
			let message;
			isClub
				? (message = 'Pomyślnie dodano klub!')
				: (message = 'Pomyślnie dodano drużynę!');
			const title = 'Sukces!';
			const duration = 2000;
			addNotification(title, message, typeNotification, duration);
			if (_id) {
				const { name: filename, imageBuffer } = imageData;
				const {
					data: { signedUrl, imageUrl, type }
				} = await axios.post(
					`${url}/${_id}/logo`,
					{ filename },
					options
				);

				const awsOptions = {
					headers: {
						'Content-Type': type
					}
				};
				await axios.put(signedUrl, imageBuffer, awsOptions);
				isClub
					? (message = 'Pomyślnie dodano logo klubu!')
					: (message = 'Pomyślnie dodano logo drużyny!');
				addNotification(title, message, typeNotification, duration);
				setTimeout(() => {
					setTeam(defaultTeam);
					setImageData(defaultImageData);
					setUpdatedTeam(!updatedTeam);
				}, duration);
			} else {
				const title = 'Informacja!';
				const message = 'Musisz stworzyć drużynę!';
				const type = 'info';
				const duration = 1500;
				addNotification(title, message, type, duration);
			}
		} catch (e) {
			const {
				response: { data }
			} = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd!';
				const message = 'Stworzenie drużyny nie powiodło się!';
				const type = 'danger';
				const duration = 3000;
				addNotification(title, message, type, duration);
			}
		}
	};

	const editClub = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			let edited = false;
			if (
				team.name !== editClubData.name ||
				team.leagueName !== editClubData.leagueName
			) {
				const leagueId = leagues.find(
					league => league.name === team.leagueName
				)._id;
				await axios.patch(
					`${url}/${team._id}`,
					{
						name: team.name,
						leagueId
					},
					options
				);
				edited = true;
			}

			if (imageData.imageBuffer) {
				const { name: filename, imageBuffer } = imageData;
				const {
					data: { signedUrl, type }
				} = await axios.post(
					`${url}/${team._id}/logo`,
					{ filename },
					options
				);
				const awsOptions = {
					headers: {
						'Content-Type': type
					}
				};
				await axios.put(signedUrl, imageBuffer, awsOptions);
				edited = true;
			}
			if (edited) {
				const title = 'Sukces!';
				const message = 'Pomyślnie edytowano klub!';
				const type = 'success';
				const duration = 1500;
				setEditClubData({
					...defaultTeam,
					_id: '',
					imageUrl: ''
				});
				setTeam(defaultTeam);
				addNotification(title, message, type, duration);
				setTimeout(() => {
					setUpdatedTeam(!updatedTeam);
				}, duration);
			}
		} catch (e) {
			const {
				response: { data }
			} = e;
			console.log(e.response);
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			} else {
				const title = 'Błąd!';
				const message = 'Edycja klubu nie powiodła się!';
				const type = 'danger';
				const duration = 3000;
				addNotification(title, message, type, duration);
			}
		}
	};

	const cancelEditingClub = () => {
		setEditClubData({
			...defaultTeam,
			_id: '',
			imageUrl: ''
		});
	};

	const handleOnSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (editClubData && editClubData._id !== '') {
			editClub();
		} else if (imageData.imageBuffer) {
			createTeam(team, imageData);
		} else {
			const title = 'Informacja!';
			const message = 'Musisz wybrać logo drużyny!';
			const type = 'info';
			const duration = 2000;
			addNotification(title, message, type, duration);
		}
	};

	useEffect(() => {
		if (editClubData) {
			setTeam(editClubData);
		}
	}, [editClubData]);

	return (
		<div className="team-create-container">
			<Typography className="heading-3 team-create-container__heading">
				{editClubData && editClubData._id ? 'Edytuj' : 'Stwórz'}{' '}
				{isClub ? 'klub' : 'drużynę'}
			</Typography>
			<form
				className={
					isClub
						? 'team-create-container__formClub'
						: 'team-create-container__form'
				}
				encType="multipart/form-data"
				onSubmit={handleOnSubmit}
			>
				<Grid container justify="center">
					<Grid
						item
						xs={12}
						md={6}
						className="team-create-container__form-fields"
					>
						<FormControl className="team-create-container__form-field">
							<TextField
								label="Nazwa"
								required
								value={team.name}
								onChange={handleOnChange('name')}
							/>
						</FormControl>
						<FormControl
							required
							className="team-create-container__form-field"
						>
							<InputLabel id="id-league">Liga</InputLabel>
							<Select
								labelId="id-league"
								value={team.leagueName}
								onChange={handleOnChange('leagueName')}
							>
								{leagues.map((league: ILeague) => (
									<MenuItem
										key={league._id}
										value={league.name}
										className="team-create-container__menu"
									>
										{league.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} md={4}>
						<div className="team-create-container__img-box">
							<input
								type="file"
								accept="image/*"
								id="id-file"
								style={{ display: 'none' }}
								onChange={handleImgFile(setImageData)}
							/>
							<label
								htmlFor="id-file"
								className="team-create-container__teamImgLabel"
							>
								{imageData.imageUrl ? (
									<img
										src={imageData.imageUrl as string}
										alt="team-logo"
										className="team-create-container__img"
									/>
								) : editClubData && editClubData.imageUrl ? (
									<img
										src={editClubData.imageUrl as string}
										alt="team-logo"
										className="team-create-container__img"
									/>
								) : (
									<FaFileUpload className="team-create-container__img-upload" />
								)}
							</label>
						</div>
					</Grid>
					<Grid item xs={12} md={10}>
						{editClubData && editClubData._id ? (
							<Grid container spacing={2}>
								<Grid item xs={6}>
									<Button
										type="submit"
										className="btn team-create-container__btn"
									>
										Edytuj
									</Button>
								</Grid>
								<Grid item xs={6}>
									<Button
										className="btn team-create-container__btn"
										onClick={cancelEditingClub}
									>
										Anuluj
									</Button>
								</Grid>
							</Grid>
						) : (
							<Button
								type="submit"
								className="btn team-create-container__btn"
							>
								Utwórz
							</Button>
						)}
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default TeamCreate;
