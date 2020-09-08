import React, { FunctionComponent, Fragment, ReactNode, useState } from 'react';
import {
	Card,
	CardHeader,
	Divider,
	List,
	ListItem,
	Checkbox,
	Grid,
	Button,
	Avatar
} from '@material-ui/core';
import addNotification from '../utils/addNotification';
import { IRider } from './TeamRiders';
import { useStateValue } from './AppProvider';

interface IProps {
	teamId: string;
}
interface IValidateRider {
	foreigners: number;
	u21: number;
	u23: number;
}

const maxForeigners = 3;
const maxAbove21YO = 5;
const maxRiders = 8;
const maxKSM = 41.0;

const not = (a: IRider[], b: IRider[]) => {
	return a.filter((rider: IRider) => b.indexOf(rider) === -1);
};

const intersection = (a: IRider[], b: IRider[]) => {
	return a.filter((rider: IRider) => b.indexOf(rider) !== -1);
};

const validateRiders = (riders: IRider[]): IValidateRider =>
	riders.reduce(
		(prev: IValidateRider, curr: IRider): IValidateRider => {
			if (curr.nationality === 'Zagraniczny') {
				prev.foreigners += 1;
			}
			if (curr.age === 'U21') {
				prev.u21 += 1;
			}
			return prev;
		},
		{ foreigners: 0, u21: 0, u23: 0 }
	);

const countKSM = (riders: IRider[]): number => {
	const compare = (riderA: IRider, riderB: IRider) => {
		if (riderA.ksm < riderB.ksm) return 1;
		else return -1;
	};
	const sortedRiders = [...riders].sort(compare);
	const bestRiders = sortedRiders.slice(0, 6);
	const ksm = bestRiders.reduce(
		(prev: number, curr: IRider): number => prev + curr.ksm,
		0
	);
	return ksm;
};

const checkTeamMatch = (riders: IRider[]): boolean => {
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
	if (riders.length >= 6 && result.u21 < 2) {
		message = `Drużyna musi składać się przynajmniej z 2 juniorów!`;
		addNotification(title, message, type, duration);
		alert = true;
	}
	return alert;
};

const TeamMatch: FunctionComponent<IProps> = ({ teamId }) => {
	const { teamRiders, setLoggedIn } = useStateValue();
	const [checked, setChecked] = useState<IRider[]>([]);
	const [left, setLeft] = useState<IRider[]>(teamRiders);
	const [right, setRight] = useState<IRider[]>([]);

	const leftChecked = intersection(checked, left);
	const rightChecked = intersection(checked, right);

	const handleToggle = (rider: IRider) => () => {
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

	const customRider = (rider: IRider) => (
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
				<Avatar src={rider.image} alt="rider-avatar" />
			</Grid>
			<Grid item xs={2}>
				{`${rider.firstName} ${rider.lastName}`}
			</Grid>
			<Grid item xs={2}>
				{rider.nationality}
			</Grid>
			<Grid item xs={1}>
				{rider.age}
			</Grid>
			<Grid item xs={1}>
				{rider.ksm}
			</Grid>
		</Grid>
	);

	const customList = (title: ReactNode, riders: IRider[], header: string) => (
		<Card>
			<CardHeader
				title={header}
				subheader={
					header === 'Kadra meczowa' &&
					`Wybrano: ${right.length}/8 KSM: ${countKSM(right).toFixed(
						2
					)}/41`
				}
			/>
			<Divider />
			<List dense component="div" role="list">
				{riders.map((rider: IRider) => {
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
