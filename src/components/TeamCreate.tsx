import React, {
	FunctionComponent,
	useState,
	ChangeEvent,
	FormEvent,
	useContext,
	SetStateAction,
	Dispatch
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
import Cookies from 'universal-cookie';
import handleImgFile, {
	IImageData,
	defaultImageData
} from '../utils/handleImgFile';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';
import { checkBadAuthorization } from '../utils/checkCookies';
import { AppContext } from './AppProvider';
import getToken from '../utils/getToken';

interface ITeamState {
	name: string;
	league: string;
}

interface IProps {
	updatedTeam: boolean;
	setUpdatedTeam: Dispatch<SetStateAction<boolean>>;
}

type SelectType = {
	name?: string | undefined;
	value: unknown;
};

const defaultTeam: ITeamState = {
	name: '',
	league: ''
};

const leagues: string[] = [
	'PGE Ekstraliga',
	'eWINNER 1. Liga',
	'2. Liga żużlowa'
];

const TeamCreate: FunctionComponent<IProps> = ({
	updatedTeam,
	setUpdatedTeam
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
			const { name, league } = team;
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const {
				data: { _id }
			} = await axios.post(
				'https://fantasy-league-eti.herokuapp.com/teams',
				{ name },
				options
			);
			const typeNotification = 'success';
			const title = 'Sukces!';
			let message = 'Pomyślnie stworzono drużynę!';
			const duration = 2000;
			addNotification(title, message, typeNotification, duration);

			const { name: filename, imageBuffer } = imageData;
			const {
				data: { signedUrl, imageUrl, type }
			} = await axios.post(
				`https://fantasy-league-eti.herokuapp.com/teams/${_id}/logo`,
				{ filename },
				options
			);

			const awsOptions = {
				headers: {
					'Content-Type': type
				}
			};
			await axios.put(signedUrl, imageBuffer, awsOptions);
			message = 'Pomyślnie dodano logo drużyny!';
			addNotification(title, message, typeNotification, duration);
			setTimeout(() => {
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
				const message = 'Stworzenie drużyny nie powiodło się!';
				const type = 'danger';
				const duration = 3000;
				addNotification(title, message, type, duration);
			}
		}
	};

	const handleOnSubmit = (event: FormEvent) => {
		event.preventDefault();
		if (imageData.imageBuffer) {
			createTeam(team, imageData);
		} else {
			const title = 'Informacja!';
			const message = 'Musisz wybrać logo drużyny!';
			const type = 'info';
			const duration = 2000;
			addNotification(title, message, type, duration);
		}
	};

	return (
		<div className="team-create-container">
			<Typography className="heading-3 team-create-container__heading">
				Stwórz drużynę
			</Typography>
			<form
				className="team-create-container__form"
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
								value={team.league}
								onChange={handleOnChange('league')}
							>
								{leagues.map((league: string) => (
									<MenuItem
										key={league}
										value={league}
										className="team-create-container__menu"
									>
										{league}
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
							<label htmlFor="id-file">
								{imageData.imageUrl ? (
									<img
										src={imageData.imageUrl as string}
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
						<Button
							type="submit"
							className="btn team-create-container__btn"
						>
							Utwórz
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default TeamCreate;
