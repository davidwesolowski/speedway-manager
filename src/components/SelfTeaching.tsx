import React, {
	useEffect,
	useState,
	FunctionComponent,
	ChangeEvent,
	FormEvent
} from 'react';
import axios from 'axios';
import { useStateValue } from './AppProvider';
import { checkCookies, checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import { setUser } from '../actions/userActions';
import { useHistory } from 'react-router-dom';
import {
	Paper,
	Grid,
	IconButton,
	Dialog,
	DialogTitle,
	Typography,
	DialogContent,
	FormControl,
	TextField,
	Button,
	Accordion,
	AccordionSummary,
	AccordionDetails
} from '@material-ui/core';
import { FaPlusCircle } from 'react-icons/fa';
import { FiX, FiChevronDown } from 'react-icons/fi';
import addNotification from '../utils/addNotification';
import Cookies from 'universal-cookie';

interface IAnswerAndQuestion {
	question: string;
	answer: string;
}

const defaultInput = {
	question: '',
	answer: ''
};

const tempData = [
	{
		question:
			'Czym jest nazwa drużyny i czy można ją zmienić w trakcie gry?',
		answer:
			'Nazwa drużyny jest wybierana przez gracza podczas tworzenia drużyny, może być edytowana, musi być unikalna.'
	},
	{
		question: 'Czy można usunąć drużynę z gry?',
		answer:
			'Tak. Można usunąć drużynę, nie usuwając swojego konta w grze, co pozwala na stworzenie nowej drużyny.'
	},
	{
		question: 'Jak wybrać kadrę w grze?',
		answer:
			'Kadra to 10 zawodników, w jej ramach tworzy się drużynę. Należy wybrać 10 zawodników (nie można mieć ich mniej). Kadra to 7 zawodników krajowych (minimum 3 młodzieżowych) i 3 zawodników obcokrajowców.'
	},
	{
		question: 'Co to jest KSM w grze?',
		answer:
			'Jest to Kalkulowana Średnia Meczowa obliczana na podstawie Średniej Indywidualnej zawodników pomnożonej razy 4.'
	},
	{
		question:
			'Ile wynosi limit KSM na drużynę w grze i jak się go oblicza?',
		answer:
			'KSM drużyny nie może przekroczyć wartości 41 pkt. Oblicza się ją jako sumę 6 najlepszych KSM zawodników zgłoszonych do drużyny (nie kadry!).'
	},
	{
		question: 'Jaki jest najniższy KSM zawodnika w grze?',
		answer: 'KSM zawodnika w grze nie może być mniejszy niż 2,50pkt.'
	},
	{
		question: 'Czy kadrę obowiązuje limit KSM w grze?',
		answer: 'Nie. KSM w kadrze ma jedynie wymiar informacyjny dla gracza.'
	}
];

const SelfTeaching: FunctionComponent = () => {
	const [input, setInput] = useState(defaultInput);
	const [answersAndQuestions, setAnswersAndQuestions] = useState<
		IAnswerAndQuestion[]
	>(tempData);
	const [open, setOpen] = useState(false);
	const { userData, dispatchUserData, setLoggedIn } = useStateValue();
	const { push } = useHistory();

	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setOpen(false);
		setInput(defaultInput);
	};
	const handleOnChange = (name: string) => (
		event: ChangeEvent<HTMLInputElement>
	) => {
		event.persist();
		if (event.target) {
			setInput(prevState => ({
				...prevState,
				[name]: event.target.value
			}));
		}
	};

	const handleOnSubmit = async (event: FormEvent) => {
		event.preventDefault();
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			await axios.post(
				'https://fantasy-league-eti.herokuapp.com/faq',
				input,
				options
			);
			setAnswersAndQuestions([...answersAndQuestions, input]);
			setInput(defaultInput);
			const title = 'Sukces!';
			const message = 'Pomyślnie dodano FAQ!';
			const type = 'success';
			const duration = 1500;
			addNotification(title, message, type, duration);
		} catch (e) {
			const { response: data } = e;
			if (data.statusCode == 401) {
				checkBadAuthorization(setLoggedIn, push);
			}
		}
	};

	useEffect(() => {
		const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};

		const checkIfUserLoggedIn = async () => {
			const cookiesExist = checkCookies();
			if (cookiesExist && !userData.username) {
				const {
					data: { username, email, avatarUrl }
				} = await axios.get(
					'https://fantasy-league-eti.herokuapp.com/users/self',
					options
				);
				dispatchUserData(setUser({ username, email, avatarUrl }));
				setLoggedIn(true);
			}
		};

		const fetchFAQs = async () => {
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/faq'
			);
			const fetchedData = data.map(({ answer, question }) => ({
				answer,
				question
			}));
			setAnswersAndQuestions(fetchedData);
		};

		try {
			checkIfUserLoggedIn();
			fetchFAQs();
		} catch (e) {
			const {
				response: { data }
			} = e;
			const title = 'Błąd!';
			const type = 'danger';
			const duration = 1000;
			if (data.statusCode == 401) {
				const message = 'Sesja wygasła!';
				const cookies = new Cookies();
				cookies.remove('accessToken');
				addNotification(title, message, type, duration);
				setLoggedIn(false);
			} else {
				const message = 'Nie można wczytać FAQs!';
				addNotification(title, message, type, duration);
			}
		}
	}, []);

	return (
		<>
			<div className="selfTeaching__container">
				<div className="selfTeaching__img"></div>
				<Paper className="selfTeaching__box">
					<Grid container justify="flex-end" alignItems="center">
						<Grid item>
							<IconButton onClick={handleOpen}>
								<FaPlusCircle className="selfTeaching__icon" />
							</IconButton>
						</Grid>
					</Grid>
					<Grid container className="selfTeaching__fields">
						{answersAndQuestions.map(answerAndQuestion => (
							<Grid
								item
								xs={12}
								sm={6}
								key={answerAndQuestion.question}
							>
								<Accordion className="selfTeaching__field">
									<AccordionSummary
										expandIcon={
											<FiChevronDown className="selfTeaching__icon-white" />
										}
									>
										<Typography className="selfTeaching__field-text">
											{answerAndQuestion.question}
										</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Typography className="selfTeaching__field-text">
											{answerAndQuestion.answer}
										</Typography>
									</AccordionDetails>
								</Accordion>
							</Grid>
						))}
					</Grid>
				</Paper>
			</div>
			<Dialog
				open={open}
				onClose={handleClose}
				className="selfTeaching__dialog"
			>
				<DialogTitle>
					<Grid container justify="space-between" alignItems="center">
						<Typography
							variant="h4"
							className="selfTeaching__dialogHeader"
						>
							Dodaj pytanie do samouczka
						</Typography>
						<IconButton onClick={handleClose}>
							<FiX className="selfTeaching__icon" />
						</IconButton>
					</Grid>
				</DialogTitle>
				<DialogContent dividers>
					<form onSubmit={handleOnSubmit}>
						<Grid container direction="column">
							<FormControl className="selfTeaching__formFields">
								<TextField
									label="Pytanie"
									required
									multiline
									value={input.question}
									onChange={handleOnChange('question')}
								/>
							</FormControl>
							<FormControl className="selfTeaching__formFields">
								<TextField
									label="Odpowiedź"
									required
									multiline
									value={input.answer}
									onChange={handleOnChange('answer')}
								/>
							</FormControl>
							<FormControl>
								<Button className="btn" type="submit">
									Dodaj pytanie
								</Button>
							</FormControl>
						</Grid>
					</form>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default SelfTeaching;
