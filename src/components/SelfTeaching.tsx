import React, { useEffect, useState, FunctionComponent } from 'react';
import axios from 'axios';
import { useStateValue } from './AppProvider';
import { checkCookies, checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import { setUser } from '../actions/userActions';
import { useHistory } from 'react-router-dom';
import {
	Paper,
	Grid,
	IconButton,
	Dialog,
	DialogTitle,
	Typography,
	DialogContent
} from '@material-ui/core';
import { FaPlusCircle } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

const SelfTeaching: FunctionComponent = () => {
	const [open, setOpen] = useState(false);
	const { userData, dispatchUserData, setLoggedIn } = useStateValue();
	const { push } = useHistory();

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	useEffect(() => {
		const checkIfUserLoggedIn = async () => {
			const cookiesExist = checkCookies();
			if (cookiesExist && !userData.username) {
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
			}
		};
		checkIfUserLoggedIn();
	}, []);

	return (
		<>
			<div className="selfTeaching__container">
				<div className="selfTeaching__img"></div>
				<Paper className="selfTeaching__box">
					<Grid container justify="flex-end" alignItems="center">
						<Grid item>
							<IconButton onClick={handleOpen}>
								<FaPlusCircle className="selfTeaching__icon" />
							</IconButton>
						</Grid>
					</Grid>
				</Paper>
			</div>
			<Dialog
				open={open}
				onClose={handleClose}
				className="selfTeaching__dialog"
			>
				<DialogTitle>
					<Grid container justify="space-between" alignItems="center">
						<Typography
							variant="h4"
							className="selfTeaching__dialogHeader"
						>
							Dodaj pytanie do samouczka
						</Typography>
						<IconButton>
							<FiX className="selfTeaching__icon" />
						</IconButton>
					</Grid>
				</DialogTitle>
				<DialogContent dividers></DialogContent>
			</Dialog>
		</>
	);
};

export default SelfTeaching;
