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
	ksm: number;
}

const maxForeigners = 3;
const maxAbove23YO = 5;
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
		ksm: 12.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '3',
		firstName: 'Nicki',
		lastName: 'Pedersen',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 8.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '4',
		firstName: 'Kenneth',
		lastName: 'Bjerre',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'NN',
		ksm: 8.5,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '5',
		firstName: 'Bartosz',
		lastName: 'Zmarzlik',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 11.5,
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
		ksm: 9.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '8',
		firstName: 'Bartosz',
		lastName: 'Smektała',
		club: 'MrGarden GKM Grudziądz',
		nationality: 'PL',
		ksm: 8.0,
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

	const numberOfChecked = (riders: ITempRider[]) =>
		intersection(checked, riders).length;

	const handleCheckRight = () => {
		setRight([...right, ...leftChecked]);
		setLeft(not(left, leftChecked));
		setChecked(not(checked, leftChecked));
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
				PL
			</Grid>
			<Grid item xs={1}>
				Junior
			</Grid>
			<Grid item xs={1}>
				KSM
			</Grid>
		</Grid>
	);

	const customList = (
		title: ReactNode,
		riders: ITempRider[],
		header: string
	) => (
		<Card className="team-match-container__card">
			<CardHeader title={header} />
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
			<Grid item xs={5} style={{ alignSelf: 'flex-start' }}>
				{customList('Choices', left, 'Cała drużyna')}
			</Grid>
			<Grid item>
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
			<Grid item xs={5} style={{ alignSelf: 'flex-start' }}>
				{customList('Chosen', right, 'Kadra meczowa')}
			</Grid>
		</Grid>
	);
};

export default TeamMatch;
