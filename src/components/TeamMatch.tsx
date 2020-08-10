import React, { FunctionComponent, ReactNode, useState } from 'react';
import {
	Card,
	CardHeader,
	Divider,
	List,
	ListItem,
	Checkbox,
	ListItemIcon,
	ListItemText,
	Grid,
	Button
} from '@material-ui/core';

interface ITempRider {
	_id: string;
	firstName: string;
	lastName: string;
	club: string;
	ksm: number;
	dateOfBirth: string;
}

const riders: ITempRider[] = [
	{
		_id: '1',
		firstName: 'Krzysztof',
		lastName: 'Buczkowski',
		club: 'MrGarden GKM Grudziądz',
		ksm: 10.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '2',
		firstName: 'Artem',
		lastName: 'Łaguta',
		club: 'MrGarden GKM Grudziądz',
		ksm: 10.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '3',
		firstName: 'Nicki',
		lastName: 'Pedersen',
		club: 'MrGarden GKM Grudziądz',
		ksm: 10.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '4',
		firstName: 'Kenneth',
		lastName: 'Bjerre',
		club: 'MrGarden GKM Grudziądz',
		ksm: 10.0,
		dateOfBirth: '06.08.2020'
	},
	{
		_id: '5',
		firstName: 'Bartosz',
		lastName: 'Zmarzlik',
		club: 'MrGarden GKM Grudziądz',
		ksm: 10.0,
		dateOfBirth: '06.08.2020'
	}
];

const not = (a: ITempRider[], b: ITempRider[]) => {
	return a.filter((rider: ITempRider) => b.indexOf(rider) === -1);
};

const intersection = (a: ITempRider[], b: ITempRider[]) => {
	return a.filter((rider: ITempRider) => b.indexOf(rider) !== -1);
};

const union = (a: ITempRider[], b: ITempRider[]) => [...a, ...not(b, a)];

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

	const customList = (
		title: ReactNode,
		riders: ITempRider[],
		header: string
	) => (
		<Card>
			<CardHeader title={header} />
			<Divider /> n
			<List dense component="div" role="list">
				{riders.map((rider: ITempRider) => {
					const value = `${rider.firstName} ${rider.lastName}`;
					const labelId = `transfer-list-all-item-${value}-label`;
					return (
						<ListItem
							key={value}
							role="listitem"
							button
							onClick={handleToggle(rider)}
						>
							<ListItemIcon>
								<Checkbox
									checked={checked.indexOf(rider) !== -1}
									tabIndex={-1}
									disableRipple
									inputProps={{ 'aria-labelledby': labelId }}
								/>
							</ListItemIcon>
							<ListItemText id={labelId} primary={value} />
						</ListItem>
					);
				})}
			</List>
		</Card>
	);

	return (
		<Grid container alignItems="center" justify="center" spacing={2}>
			<Grid item>{customList('Choices', left, 'Cała drużyna')}</Grid>
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
			<Grid item style={{ alignSelf: 'flex-start' }}>
				{customList('Chosen', right, 'Kadra meczowa')}
			</Grid>
		</Grid>
	);
};

export default TeamMatch;
