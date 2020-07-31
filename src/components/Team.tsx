import React, {
	FunctionComponent,
	ReactNode,
	useState,
	ChangeEvent
} from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Paper, Typography, Divider, Box, Tabs, Tab } from '@material-ui/core';

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
	// eslint-disable-next-line @typescript-eslint/ban-types
	const handleChange = (event: ChangeEvent<{}>, newValue: number) =>
		setValue(newValue);

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
							<Tab label="Kadra" {...a11yProps(1)} />
							<Tab label="Skład meczowy" {...a11yProps(2)} />
						</Tabs>
					</Paper>
					<TabPanel value={value} index={0}>
						Stwórz drużynę
					</TabPanel>
					<TabPanel value={value} index={1}>
						Dodaj zawodników
					</TabPanel>
					<TabPanel value={value} index={2}>
						Skład meczowy
					</TabPanel>
				</div>
			</Paper>
		</div>
	);
};

export default Team;
