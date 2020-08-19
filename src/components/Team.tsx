import React, {
	FunctionComponent,
	ReactNode,
	useState,
	ChangeEvent,
	useEffect,
	useContext
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
import Cookies from 'universal-cookie';
import TeamCreate from './TeamCreate';
import TeamGeneral from './TeamGeneral';
import { AppContext } from './AppProvider';
import { checkBadAuthorization } from '../validation/checkCookies';
import { setUser } from '../actions/userActions';
import TeamMatch from './TeamMatch';

interface ITabPanelProps {
	children?: ReactNode;
	index: any;
	value: any;
}

interface ITeamState {
	name: string;
	logo_url: string;
	_id: string;
}

export interface IRider {
	_id: string;
	firstName: string;
	lastName: string;
	club: string;
	nationality: string;
	ksm: number;
	dateOfBirth: string;
	age: string;
}

const defaultTeamState = {
	name: '',
	logo_url: '',
	_id: ''
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
	const [riders, setRiders] = useState<IRider[]>([]);
	const [updatedTeam, setUpdatedTeam] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true);
	const { push } = useHistory();
	const { setLoggedIn, dispatchUserData, userData } = useContext(AppContext);
	// eslint-disable-next-line @typescript-eslint/ban-types
	const handleChange = (event: ChangeEvent<{}>, newValue: number) =>
		setValue(newValue);

	useEffect(() => {
		setLoading(true);
		const cookies = new Cookies();
		const access_token = cookies.get('access_token');
		const options = {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		};
		const fetchTeamRiders = async (_id: string) => {
			try {
				const { data: riders } = await axios.get(
					`https://fantasy-league-eti.herokuapp.com/teams/${_id}/riders`,
					options
				);
				if (riders.length) {
					const newRiders = riders.map(({ rider }) => {
						const dateOfBirth = rider.date_of_birth;
						const riderAgeYear = new Date(
							dateOfBirth
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
						return {
							firstName: rider.first_name,
							lastName: rider.last_name,
							nationality,
							dateOfBirth,
							age,
							ksm: 0,
							_id: 0,
							club: ''
						};
					});
					setRiders(newRiders);
				}
			} catch (e) {
				const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				}
			}
		};
		const fetchTeam = async () => {
			try {
				const { data } = await axios.get(
					'https://fantasy-league-eti.herokuapp.com/teams',
					options
				);
				if (data.length && data[0]) {
					const { name, logo_url, _id } = data[0];
					fetchTeamRiders(_id);
					setTeam({ name, logo_url, _id });
				} else {
					setTeam(defaultTeamState);
				}
			} catch (e) {
				/*const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				}*/
			}
		};
		const fetchUserData = async () => {
			try {
				const {
					data: { username, email, avatar_url }
				} = await axios.get(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					options
				);
				dispatchUserData(setUser({ username, email, avatar_url }));
				setLoggedIn(true);
			} catch (e) {
				/*const {
					response: { data }
				} = e;
				if (data.statusCode == 401) {
					checkBadAuthorization(setLoggedIn, push);
				}*/
			}
		};

		fetchTeam();
		if (!userData.username) fetchUserData();
		setLoading(false);
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
								riders={riders}
								updatedTeam={updatedTeam}
								setUpdatedTeam={setUpdatedTeam}
							/>
						) : (
							<TeamCreate
								updatedTeam={updatedTeam}
								setUpdatedTeam={setUpdatedTeam}
							/>
						)}
					</TabPanel>
					<TabPanel value={value} index={1}>
						<TeamMatch riders={riders} />
					</TabPanel>
				</div>
			</Paper>
		</div>
	);
};

export default Team;
