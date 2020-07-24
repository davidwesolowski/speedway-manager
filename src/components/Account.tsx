/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { FunctionComponent, useState } from 'react';
import {
	Paper,
	Typography,
	Divider,
	TextField,
	IconButton,
	Button,
	Dialog,
	DialogTitle
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { TiPen, TiTimes } from 'react-icons/ti';
import { FiX } from 'react-icons/fi';

interface IState {
	username: string;
	name: string;
	club: string;
	points: number;
	position: number;
}

const Account: FunctionComponent = () => {
	const accountDefaultData = {
		username: 'Testowy',
		name: 'Test',
		club: 'GKM',
		points: 0,
		position: -1
	};
	const [accountData, setAccountData] = useState<IState>(accountDefaultData);
	const [dialogOpen, setDialogOpen] = useState<boolean>(true);

	const handleOpen = () => setDialogOpen(true);
	const handleClose = () => setDialogOpen(false);

	return (
		<>
			<div className="account-info">
				<div className="account-info__background"></div>
				<Paper className="account-info__box">
					<Typography variant="h2" className="account-info__header">
						{accountData.username} ({accountData.name})
					</Typography>
					<Divider />
					<div className="account-info__avatar-part">
						<div className="account-info__avatar-img-box">
							<img
								src="/img/kenny.jpg"
								alt="user-avatar"
								className="account-info__avatar-img"
							></img>
						</div>
						<Link
							to="/zmien-awatar"
							className="account-info__change-avatar"
						>
							Zmień swój awatar
						</Link>
					</div>
					<div className="account-info__account-data-part">
						<div className="account-info__nickname-row">
							<div className="account-info__username"></div>
							<div className="account-info__change-nickname-part">
								<div
									className="account-info__change-nickname"
									onClick={handleOpen}
								>
									<TiPen /> Edytuj konto
								</div>
								<br />
								<br />
								<div className="account-info__delete-account">
									<TiTimes /> Usuń konto
								</div>
							</div>
						</div>
						<br />
						<br />
						<div>
							<Typography
								variant="h5"
								className="account-info__stats"
							>
								<strong>Nazwa klubu:</strong>{' '}
								<Link to="/klub" className="account-info__club">
									{accountData.club}
								</Link>
							</Typography>
						</div>
						<br />
						<div>
							<Typography
								variant="h5"
								className="account-info__stats"
							>
								<strong>Punkty:</strong> {accountData.points}
							</Typography>
						</div>
						<br />
						<div>
							<Typography
								variant="h5"
								className="account-info__stats"
							>
								<strong>Pozycja w rankingu:</strong>{' '}
								{accountData.position}
							</Typography>
						</div>
						<br />
						<div>
							<Typography
								variant="h5"
								className="account-info__stats"
							>
								<strong>Hasło:</strong> ***********
							</Typography>
						</div>
					</div>
				</Paper>
			</div>
			<Dialog open={dialogOpen} onClose={handleClose} className="dialog">
				<DialogTitle>
					<div className="dialog__header">
						<Typography variant="h4" className="dialog__title">
							Edycja konta
						</Typography>
						<IconButton>
							<FiX />
						</IconButton>
					</div>
				</DialogTitle>
			</Dialog>
		</>
	);
};

//do linii 41: <Typography variant="h3"> {AccountData.Username} ({AccountData.Name}) </Typography>
//do linii 75: <Link to="/zmien-haslo" className="account-info__change-pwd">Zmień hasło</Link>

export default Account;
