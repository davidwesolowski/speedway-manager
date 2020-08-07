import React, { FunctionComponent, useState } from 'react';
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
	Button
} from '@material-ui/core';
import { FaTrashAlt, FaPencilAlt } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import { IImageData, defaultImageData } from '../utils/handleImgFile';

const riders = [
	{
		firstName: 'Krzysztof',
		lastName: 'Buczkowski',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	},
	{
		firstName: 'Artem',
		lastName: 'Łaguta',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	},
	{
		firstName: 'Nicki',
		lastName: 'Pedersen',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	},
	{
		firstName: 'Kenneth',
		lastName: 'Bjerre',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	},
	{
		firstName: 'Bartosz',
		lastName: 'Zmarzlik',
		club: 'MrGarden GKM Grudziądz',
		ksm: '10.0',
		dateOfBirth: '06.08.2020'
	}
];

interface IProps {
	name: string;
	logo_url: string;
}

const TeamGeneral: FunctionComponent<IProps> = ({ name, logo_url }) => {
	const [editOpen, setEditOpen] = useState<boolean>(true);
	const [teamName, setTeamName] = useState<string>(name || '');
	const [imageData, setImageData] = useState<IImageData>(defaultImageData);

	const handleEditClose = () => {
		setTeamName(name || '');
		setEditOpen(false);
		setImageData(defaultImageData);
	};

	const handleEditOpen = () => setEditOpen(true);

	return (
		<>
			<Grid container alignItems="flex-start" className="team-container">
				<Grid item xs={12} md={4}>
					<div className="team-container__left-pane">
						<div className="team-container__edit-delete-pane">
							<IconButton onClick={handleEditOpen}>
								<FaPencilAlt />
							</IconButton>
							<IconButton>
								<FaTrashAlt />
							</IconButton>
						</div>
						<Typography className="heading-1 team-container__name">
							{name}
						</Typography>
						<div className="team-container__logo-box">
							<img
								src={logo_url}
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
										<TableRow
											key={
												rider.firstName +
												rider.firstName
											}
											hover={true}
										>
											<TableCell>
												{rider.firstName}
											</TableCell>
											<TableCell>
												{rider.lastName}
											</TableCell>
											<TableCell>
												{rider.dateOfBirth}
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
					>
						<Grid container alignItems="center">
							<Grid item xs={1}></Grid>
							<Grid item xs={5}>
								<FormGroup>
									<TextField label="Nazwa" value={teamName} />
								</FormGroup>
							</Grid>
							<Grid item xs={6}>
								<input
									type="file"
									style={{ display: 'none' }}
									accept="image/*"
									id="id-file"
								/>
								<label htmlFor="id-file">
									<div className="dialog__avatar-img-box">
										{imageData.imageUrl ? (
											<img
												src={
													imageData.imageUrl as string
												}
												alt="team-logo"
												className="dialog__avatar-img"
											/>
										) : (
											<img
												src={logo_url}
												alt="team-logo"
												className="dialog__avatar-img"
											/>
										)}
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
		</>
	);
};

export default TeamGeneral;
