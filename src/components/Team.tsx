import React, {
	FunctionComponent,
	ReactNode,
	useState,
	ChangeEvent,
	useEffect,
	useContext
} from 'react';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Paper, Typography, Divider, Box, Tabs, Tab } from '@material-ui/core';
import axios from 'axios';
import Cookies from 'universal-cookie';
import TeamCreate from './TeamCreate';
import TeamGeneral from './TeamGeneral';
import { AppContext } from './AppProvider';
import { checkBadAuthorization } from '../validation/checkCookies';
import { setUser } from '../actions/userActions';

interface ITabPanelProps {
	children?: ReactNode;
	index: any;
	value: any;
}

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
	const [team, setTeam] = useState<{ name: string; logo_url: string }>({
		name: '',
		logo_url: ''
	});
	const { push } = useHistory();
	const { setLoggedIn, dispatchUserData, userData } = useContext(AppContext);
	// eslint-disable-next-line @typescript-eslint/ban-types
	const handleChange = (event: ChangeEvent<{}>, newValue: number) =>
		setValue(newValue);

	useEffect(() => {
		const cookies = new Cookies();
		const access_token = cookies.get('access_token');
		const options = {
			headers: {
				Authorization: `Bearer ${access_token}`
			}
		};
		const fetchTeam = async () => {
			try {
				const { data } = await axios.get(
					'https://fantasy-league-eti.herokuapp.com/teams',
					options
				);
				if (data.length && data[0]) {
					const { name, logo_url } = data[0];
					setTeam({ name, logo_url });
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
				/**/
			}
		};
		fetchTeam();
		if (!userData.username) fetchUserData();
	}, []);

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
				<div className="team-container__tabs-container">
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
						{team.name ? (
							<TeamGeneral
								name={team.name}
								logo_url={team.logo_url}
							/>
						) : (
							<TeamCreate />
						)}
					</TabPanel>
					<TabPanel value={value} index={1}>
						Skład meczowy
					</TabPanel>
				</div>
			</Paper>
		</div>
	);
};

export default Team;
