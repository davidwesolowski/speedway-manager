import React, { FunctionComponent, useState, ChangeEvent } from 'react';
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

interface ITeamState {
	name: string;
	league: string;
	imageBuffer: string | ArrayBuffer | null;
	imageUrl: string | ArrayBuffer | null;
}

type SelectType = {
	name?: string | undefined;
	value: unknown;
};

const defaultTeam: ITeamState = {
	name: '',
	league: '',
	imageBuffer: '',
	imageUrl: ''
};

const leagues: string[] = [
	'PGE Ekstraliga',
	'eWINNER 1. Liga',
	'2. Liga żużlowa'
];

const TeamCreate: FunctionComponent = () => {
	const [team, setTeam] = useState<ITeamState>(defaultTeam);

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

	return (
		<div className="team-create-container">
			<Typography className="heading-3 team-create-container__heading">
				Stwórz drużynę
			</Typography>
			<form
				className="team-create-container__form"
				encType="multipart/form-data"
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
							/>
							<label htmlFor="id-file">
								<FaFileUpload className="team-create-container__img-upload" />
							</label>
						</div>
					</Grid>
					<Grid item xs={12} md={10}>
						<Button className="btn team-create-container__btn">
							Utwórz
						</Button>
					</Grid>
				</Grid>
			</form>
		</div>
	);
};

export default TeamCreate;
