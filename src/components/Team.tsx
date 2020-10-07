import React, {
	FunctionComponent,
	ReactNode,
	useState,
	ChangeEvent,
	useEffect
} from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import {
	Paper,
	Typography,
	Divider,
	Box,
	Tabs,
	Tab,
	CircularProgress,
	Grid
} from '@material-ui/core';
import axios from 'axios';
import TeamCreate from './TeamCreate';
import TeamGeneral from './TeamGeneral';
import { useStateValue } from './AppProvider';
import { checkBadAuthorization } from '../utils/checkCookies';
import TeamMatch from './TeamMatch';
import getToken from '../utils/getToken';
import { setTeamRiders } from '../actions/teamRidersActions';
import fetchUserData from '../utils/fetchUserData';
import { IRider } from './TeamRiders';
import addNotification from '../utils/addNotification';

interface ITabPanelProps {
	children?: ReactNode;
	index: any;
	value: any;
}

interface ITeamState {
	name: string;
	logoUrl: string;
	_id: string;
}

export interface ILeague {
	_id: string;
	name: string;
}

const defaultTeamState = {
	name: '',
	logoUrl: '',
	_id: ''
};

const defaultLeague: ILeague = {
	_id: '-1',
	name: 'Brak lig'
};

const TabPanel = (props: ITabPanelProps) => {
	const { children, value, index, ...other } = props;
	return (
		<div
			id={`team-tabpanel-${index}`}
			aria-labelledby={`team-tab-${index}`}
			role="tabpanel"
			hidden={value !== index}
			{...other}
		>
			{value === index && <Box p={2}>{children}</Box>}
		</div>
	);
};

const a11yProps = (index: any) => ({
	id: `team-tab-${index}`,
	'aria-controls': `team-tabpanel-${index}`
});

const Team: FunctionComponent<RouteComponentProps> = () => {
	const [value, setValue] = useState<number>(0);
	const [team, setTeam] = useState<ITeamState>(defaultTeamState);
	const [leagues, setLeagues] = useState<ILeague[]>([defaultLeague]);
	const [updatedTeam, setUpdatedTeam] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const { push } = useHistory();
	const {
		setLoggedIn,
		dispatchUserData,
		userData,
		dispatchTeamRiders
	} = useStateValue();

	// eslint-disable-next-line @typescript-eslint/ban-types
	const handleChange = (event: ChangeEvent<{}>, newValue: number) =>
		setValue(newValue);

	useEffect(() => {
		setLoading(true);
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const fetchTeamRiders = async (_id: string) => {
			const { data: riders } = await axios.get(
				`https://fantasy-league-eti.herokuapp.com/teams/${_id}/riders`,
				options
			);
			if (riders.length) {
				const newRiders: IRider[] = await Promise.all(
					riders.map(async ({ rider, isActive }) => {
						const riderAgeYear = new Date(
							rider.dateOfBirth
						).getFullYear();
						const currentYear = new Date().getFullYear();
						const diffYear = currentYear - riderAgeYear;
						const age =
							diffYear <= 21
								? 'U21'
								: diffYear <= 23
								? 'U23'
								: 'Senior';
						const nationality = rider.isForeigner
							? 'Zagraniczny'
							: 'Krajowy';
						let club = '';
						if (rider.clubId) {
							const { data } = await axios.get(
								`https://fantasy-league-eti.herokuapp.com/clubs/${rider.clubId}`,
								options
							);
							club = data.name;
						}
						return {
							_id: rider._id,
							firstName: rider.firstName,
							lastName: rider.lastName,
							dateOfBirth: rider.dateOfBirth,
							image: rider.image,
							ksm: rider.KSM,
							isActive,
							nationality,
							age,
							club
						};
					})
				);
				dispatchTeamRiders(setTeamRiders(newRiders));
			}
		};
		const fetchTeam = async () => {
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/teams',
				options
			);
			if (data.length && data[0]) {
				const { name, logoUrl, _id } = data[0];
				fetchTeamRiders(_id);
				setTeam({ name, logoUrl, _id });
			} else {
				setTeam(defaultTeamState);
			}
		};
		const fetchLeagues = async () => {
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/leagues',
				options
			);
			const leagues = data.map(({ _id, name }) => ({
				_id,
				name
			}));
			setLeagues(leagues);
			return leagues;
		};
		(async function () {
			try {
				await fetchTeam();
				await fetchLeagues();
				if (!userData.username)
					await fetchUserData(dispatchUserData, setLoggedIn, push);
				setLoading(false);
				setTimeout(() => {
					document.body.style.overflow = 'auto';
				}, 500);
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				} else {
					const title = 'Błąd!';
					const message =
						'Nie udało się pobrać informacji o drużynie!';
					const type = 'danger';
					const duration = 1500;
					addNotification(title, message, type, duration);
				}
			}
		})();
	}, [updatedTeam]);

	return (
		<div className="team-container">
			<div className="team-container__img"></div>
			<Paper className="team-container__box">
				<Typography
					variant="h2"
					className="heading-1 team-container__heading"
				>
					Zarządzaj swoją drużyną marzeń!
				</Typography>
				<Divider />
				<div className="team-container__tabsContainer">
					<Paper>
						<Tabs value={value} onChange={handleChange} centered>
							<Tab label="Drużyna" {...a11yProps(0)} />
							<Tab
								disabled={team.name ? false : true}
								label="Skład meczowy"
								{...a11yProps(1)}
							/>
						</Tabs>
					</Paper>
					<TabPanel value={value} index={0}>
						{loading ? (
							<Grid
								container
								justify="center"
								alignItems="center"
								className="team-container__tabsLoading"
							>
								<CircularProgress />
							</Grid>
						) : team.name ? (
							<TeamGeneral
								team={team}
								updatedTeam={updatedTeam}
								setUpdatedTeam={setUpdatedTeam}
							/>
						) : (
							<TeamCreate
								updatedTeam={updatedTeam}
								setUpdatedTeam={setUpdatedTeam}
								leagues={leagues}
								url="https://fantasy-league-eti.herokuapp.com/teams"
							/>
						)}
					</TabPanel>
					<TabPanel value={value} index={1}>
						<TeamMatch teamId={team._id} />
					</TabPanel>
				</div>
			</Paper>
		</div>
	);
};

export default Team;
