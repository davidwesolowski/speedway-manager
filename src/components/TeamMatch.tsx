import React, { FunctionComponent, Fragment, ReactNode, useState } from 'react';
import {
	Card,
	CardHeader,
	Divider,
	List,
	ListItem,
	Checkbox,
	Grid,
	Button
} from '@material-ui/core';
import addNotification from '../utils/addNotification';

interface ITempRider {
	_id: string;
	firstName: string;
	lastName: string;
	club: string;
	nationality: string;
	ksm: number;
	dateOfBirth: string;
}

interface IValidateRider {
	foreigners: number;
	u21: number;
	u23: number;
}

const maxForeigners = 3;
const maxAbove23YO = 5;
const maxRiders = 8;
const maxKSM = 41.0;

const riders: ITempRider[] = [
	{
		_id: '1',
		firstName: 'Krzysztof',
		lastName: 'Buczkowski',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 3.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '2',
		firstName: 'Artem',
		lastName: 'Łaguta',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 5.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '3',
		firstName: 'Nicki',
		lastName: 'Pedersen',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 5.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '4',
		firstName: 'Kenneth',
		lastName: 'Bjerre',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 4,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '5',
		firstName: 'Bartosz',
		lastName: 'Zmarzlik',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 4.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '6',
		firstName: 'Szymon',
		lastName: 'Woźniak',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 2.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '7',
		firstName: 'Maciej',
		lastName: 'Janowski',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 5.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '8',
		firstName: 'Bartosz',
		lastName: 'Smektała',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 3.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '9',
		firstName: 'Dominik',
		lastName: 'Kubera',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 7.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '10',
		firstName: 'Emil',
		lastName: 'Sajfutdinow',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 12.0,
		dateOfBirth: '06.08.2020'
	}
];

const not = (a: ITempRider[], b: ITempRider[]) => {
	return a.filter((rider: ITempRider) => b.indexOf(rider) === -1);
};

const intersection = (a: ITempRider[], b: ITempRider[]) => {
	return a.filter((rider: ITempRider) => b.indexOf(rider) !== -1);
};

const validateRiders = (riders: ITempRider[]): IValidateRider =>
	riders.reduce(
		(prev: IValidateRider, curr: ITempRider): IValidateRider => {
			if (curr.nationality.toUpperCase() !== 'PL') {
				prev.foreigners += 1;
			}
			return prev;
		},
		{ foreigners: 0, u21: 0, u23: 0 }
	);

const countKSM = (riders: ITempRider[]): number => {
	const compare = (riderA: ITempRider, riderB: ITempRider) => {
		if (riderA.ksm < riderB.ksm) return 1;
		else return -1;
	};
	const sortedRiders = [...riders].sort(compare);
	const bestRiders = sortedRiders.slice(0, 6);
	const ksm = bestRiders.reduce(
		(prev: number, curr: ITempRider): number => prev + curr.ksm,
		0
	);
	return ksm;
};

const checkTeamMatch = (riders: ITempRider[]): boolean => {
	let alert = false;
	const result = validateRiders(riders);
	const ksm = countKSM(riders);
	const title = 'Informacja!';
	const type = 'info';
	const duration = 3000;
	let message;
	if (ksm > maxKSM) {
		message = `KSM drużyny może maksymalnie wynosić ${maxKSM}!`;
		addNotification(title, message, type, duration);
		alert = true;
	}
	if (riders.length > 8) {
		message = `Drużyna może się składać tylko z ${maxRiders} zawodników!`;
		addNotification(title, message, type, duration);
		alert = true;
	}
	if (result.foreigners > maxForeigners) {
		message = `Drużyna może składać się maksymalnie z ${maxForeigners} obcokrajowców!`;
		addNotification(title, message, type, duration);
		alert = true;
	}
	return alert;
};

const TeamMatch: FunctionComponent = () => {
	const [checked, setChecked] = useState<ITempRider[]>([]);
	const [left, setLeft] = useState<ITempRider[]>(riders);
	const [right, setRight] = useState<ITempRider[]>([]);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	const handleToggle = (rider: ITempRider) => () => {
		const currentIndex = checked.indexOf(rider);
		const newChecked = [...checked];
		if (currentIndex === -1) {
			newChecked.push(rider);
		} else {
			newChecked.splice(currentIndex, 1);
		}
		setChecked(newChecked);
	};

	const handleCheckRight = () => {
		const newRight = [...right, ...leftChecked];
		const result = checkTeamMatch(newRight);
		if (!result) {
			setRight([...right, ...leftChecked]);
			setLeft(not(left, leftChecked));
			setChecked(not(checked, leftChecked));
		}
	};

	const handleCheckAllLeft = () => {
		setRight([]);
		setLeft([...left, ...right]);
	};

	const handleCheckLeft = () => {
		setLeft([...left, ...rightChecked]);
		setRight(not(right, rightChecked));
		setChecked(not(checked, rightChecked));
	};

	const customRider = (rider: ITempRider) => (
		<Grid
			container
			justify="space-evenly"
			alignItems="center"
			className="team-match-container__rider"
		>
			<Grid item xs={1}>
				<Checkbox
					checked={checked.indexOf(rider) !== -1}
					tabIndex={-1}
					disableRipple
				/>
			</Grid>
			<Grid item xs={1}>
				{rider._id}
			</Grid>
			<Grid item xs={3}>
				{`${rider.firstName} ${rider.lastName}`}
			</Grid>
			<Grid item xs={1}>
				{rider.nationality}
			</Grid>
			<Grid item xs={1}>
				Junior
			</Grid>
			<Grid item xs={1}>
				{rider.ksm}
			</Grid>
		</Grid>
	);

	const customList = (
		title: ReactNode,
		riders: ITempRider[],
		header: string
	) => (
		<Card>
			<CardHeader
				title={header}
				subheader={
					header === 'Kadra meczowa' &&
					`Wybrano: ${right.length}/8 KSM: ${countKSM(right)}/41`
				}
			/>
			<Divider />
			<List dense component="div" role="list">
				{riders.map((rider: ITempRider) => {
					return (
						<Fragment key={rider._id}>
							<ListItem
								role="listitem"
								button
								onClick={handleToggle(rider)}
							>
								{customRider(rider)}
							</ListItem>
							<Divider />
						</Fragment>
					);
				})}
			</List>
		</Card>
	);

	return (
		<Grid
			container
			alignItems="center"
			justify="center"
			spacing={2}
			className="team-match-container"
		>
			<Grid item xs={12} lg={5} style={{ alignSelf: 'flex-start' }}>
				{customList('Choices', left, 'Cała drużyna')}
			</Grid>
			<Grid item xs={2}>
				<Grid container direction="column" alignItems="center">
					<Button
						variant="outlined"
						size="small"
						aria-label="move selected right"
						onClick={handleCheckRight}
					>
						&gt;
					</Button>
					<Button
						variant="outlined"
						size="small"
						aria-label="move all left"
						onClick={handleCheckAllLeft}
					>
						≪
					</Button>
					<Button
						variant="outlined"
						size="small"
						aria-label="move selected left"
						onClick={handleCheckLeft}
					>
						&lt;
					</Button>
				</Grid>
			</Grid>
			<Grid item xs={12} lg={5} style={{ alignSelf: 'flex-start' }}>
				{customList('Chosen', right, 'Kadra meczowa')}
			</Grid>
			<Button onClick={handleCheckLeft} className="btn">
				Zgłoś drużynę
			</Button>
		</Grid>
	);
};

export default TeamMatch;
