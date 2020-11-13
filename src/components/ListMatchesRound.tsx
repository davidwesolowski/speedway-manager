import React, { FunctionComponent, useState, useEffect } from 'react';
import { Typography, Divider } from '@material-ui/core';
import ListMatchesMatch from './ListMatchesMatch';
import getToken from '../utils/getToken';
import axios from 'axios';
import addNotification from '../utils/addNotification';
import { useHistory } from 'react-router-dom';
import { useStateValue } from './AppProvider';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

interface IProps {
	round: number;
	roundId: string;
	startDate: string;
	endDate: string;
	riders: Array<IRider>;
}

interface IRider {
	_id: string;
	firstName: string;
	lastName: string;
	nickname: string;
	dateOfBirth: Date;
	isForeigner: boolean;
	ksm: number;
	clubId: string;
}

interface IMatch {
	matchId: string;
	homeId: string;
	awayId: string;
	homeScore: number;
	awayScore: number;
}

const ListMatchesRound: FunctionComponent<IProps> = ({
	round,
	roundId,
	startDate,
	endDate,
	riders
}) => {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState<boolean>(true);

	const getMatchesOfRound = async roundId => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
		const { data } = await axios.get(
			`https://fantasy-league-eti.herokuapp.com/matches?roundId=${roundId}`,
			options
		);
		setMatches([]);
		setMatches(data);
	};

	const generateMatches = () => {
		if (matches.length === 0 && round !== 0) {
			return (
				<CSSTransition
					in={matches.length >= 0}
					timeout={300}
					classNames="animationScaleUp"
					unmountOnExit
				>
					<div className="list-matches__noDataInfo">
						Brak danych o meczach w tej kolejce
					</div>
				</CSSTransition>
			);
		} else if (round !== 0) {
			return (
				<TransitionGroup component={null}>
					{matches.map(match => (
						<CSSTransition
							key={match._id}
							timeout={500}
							classNames="animationScaleUp"
						>
							<ListMatchesMatch
								key={match._id}
								matchId={match._id}
								homeId={match.homeId}
								awayId={match.awayId}
								homeScore={match.homeScore}
								awayScore={match.awayScore}
								riders={riders}
								date={match.date}
								wasRidden={match.wasRidden}
							/>
						</CSSTransition>
					))}
				</TransitionGroup>
			);
		}
	};

	const generateRoundTitle = () => {
		if (round !== 0) {
			return `Kolejka ${round}. ( ${new Date(
				startDate
			).toLocaleDateString()} - ${new Date(
				endDate
			).toLocaleDateString()} )`;
		}
	};

	useEffect(() => {
		setLoading(true);
		(async function () {
			try {
				await getMatchesOfRound(roundId);
			} catch (e) {
				addNotification(
					'Błąd!',
					'Nie udało się pobrać danych z bazy',
					'danger',
					1500
				);
			}
			setLoading(false);
		})();
	}, []);

	return (
		<>
			<div className="list-matches-round">
				<Typography className="list-matches-round__title">
					{generateRoundTitle()}
				</Typography>
				<Divider />
				{generateMatches()}
			</div>
		</>
	);
};

export default ListMatchesRound;
