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
	return <div>hello</div>;
};

export default TeamMatch;
