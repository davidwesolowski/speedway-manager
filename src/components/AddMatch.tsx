import React, { FunctionComponent, useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Paper, Typography, Divider, Button, InputLabel, MenuItem, Select, TextField, Dialog, DialogTitle, IconButton, DialogContent, Grid, FormControl } from "@material-ui/core";
import { FiX } from "react-icons/fi";
import { MuiPickersUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import getToken from "../utils/getToken";
import axios from "axios";
import addNotification from "../utils/addNotification";
import validateRoundData from "../validation/validateRoundData";
import { ValidationErrorItem } from "@hapi/joi";
import { deepOrange } from "@material-ui/core/colors";

interface IRiderPoints{
    _id: string;
    points: number;
}

interface IRoundCreate{
    startDate: Date;
    endDate: Date;
    number: number;
}

interface ITeamPoints{
    team_id: string;
    rider_1: IRiderPoints;
    rider_2: IRiderPoints;
    rider_3: IRiderPoints;
    rider_4: IRiderPoints;
    rider_5: IRiderPoints;
    rider_6: IRiderPoints;
    rider_7: IRiderPoints;
    rider_8: IRiderPoints;
}

interface IValidatedPoints{
    points_1: {
        message: string;
        error: boolean;
    }
    points_2: {
        message: string;
        error: boolean;
    }
    points_3: {
        message: string;
        error: boolean;
    }
    points_4: {
        message: string;
        error: boolean;
    }
    points_5: {
        message: string;
        error: boolean;
    }
    points_6: {
        message: string;
        error: boolean;
    }
    points_7: {
        message: string;
        error: boolean;
    }
    points_8: {
        message: string;
        error: boolean;
    }
    points_9: {
        message: string;
        error: boolean;
    }
    points_10: {
        message: string;
        error: boolean;
    }
    points_11: {
        message: string;
        error: boolean;
    }
    points_12: {
        message: string;
        error: boolean;
    }
    points_13: {
        message: string;
        error: boolean;
    }
    points_14: {
        message: string;
        error: boolean;
    }
    points_15: {
        message: string;
        error: boolean;
    }
    points_16: {
        message: string;
        error: boolean;
    }
}

interface IValidatedRound{
    number: {
        message: string;
        error: boolean;
    }
    startDate: {
        message: string;
        error: boolean;
    }
    endDate: {
        message: string;
        error: boolean;
    }
}

const AddMatch: FunctionComponent<RouteComponentProps> = ({
    history: { push }
}) => {

    const defaultRiderPoints = {
        _id: '',
        points: 0
    }

    const defaultRoundCreate = {
        startDate: new Date(),
        endDate: new Date(),
        number: 0
    }

    const [roundCreate, setRoundCreate] = useState<IRoundCreate>(defaultRoundCreate)
    const [rounds, setRounds] = useState([])
    const [clubs, setClubs] = useState([])
    const [riders, setRiders] = useState([])

    const getRiders = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/riders',
				options
			);
			setRiders([]);
			data.map(rider => {
				setRiders(riders =>
					riders.concat({
						id: rider._id,
						firstName: rider.firstName,
						lastName: rider.lastName,
						nickname: rider.nickname,
						dateOfBirth: rider.dateOfBirth,
						isForeigner: rider.isForeigner,
						ksm: rider.KSM,
						clubId: rider.clubId
					})
				);
			});
		} catch (e) {
			console.log(e.response);
			if (e.response.statusText == 'Unauthorized') {
				addNotification('Błąd', 'Sesja wygasła', 'danger', 3000);
				setTimeout(() => {
					push('/login');
				}, 3000);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się pobrać zawodników z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in getting riders');
		}
	};

    const getClubs = async () => {
		try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.get(
				'https://fantasy-league-eti.herokuapp.com/clubs',
				options
			);
			setClubs([]);
			data.map(club => {
				setClubs(clubs =>
					clubs.concat({
						id: club._id,
						name: club.name
					})
				);
			});
		} catch (e) {
			console.log(e.response);
			if (e.response.statusText == 'Unauthorized') {
				addNotification('Błąd', 'Sesja wygasła', 'danger', 3000);
				setTimeout(() => {
					push('/login');
				}, 3000);
			} else {
				addNotification(
					'Błąd',
					'Nie udało się pobrać klubów z bazy',
					'danger',
					3000
				);
			}
			throw new Error('Error in getting clubs');
		}
	};

    const defaultValidatedPoints = {
        points_1: {
            message: '',
            error: false
        },
        points_2: {
            message: '',
            error: false
        },
        points_3: {
            message: '',
            error: false
        },
        points_4: {
            message: '',
            error: false
        },
        points_5: {
            message: '',
            error: false
        },
        points_6: {
            message: '',
            error: false
        },
        points_7: {
            message: '',
            error: false
        },
        points_8: {
            message: '',
            error: false
        },
        points_9: {
            message: '',
            error: false
        },
        points_10: {
            message: '',
            error: false
        },
        points_11: {
            message: '',
            error: false
        },
        points_12: {
            message: '',
            error: false
        },
        points_13: {
            message: '',
            error: false
        },
        points_14: {
            message: '',
            error: false
        },
        points_15: {
            message: '',
            error: false
        },
        points_16: {
            message: '',
            error: false
        }
    }

    const defaultValidatedRound = {
        number: {
            message: '',
            error: false
        },
        startDate: {
            message: '',
            error: false
        },
        endDate: {
            message: '',
            error: false
        }
    }

    const [validatedRound, setValidatedRound] = useState<IValidatedRound>(defaultValidatedRound)

    const [validatedPoints, setValidatedPoints] = useState<IValidatedPoints>(defaultValidatedPoints)

    const [home, setHome] = useState<ITeamPoints>({
        team_id: '',
        rider_1: defaultRiderPoints,
        rider_2: defaultRiderPoints,
        rider_3: defaultRiderPoints,
        rider_4: defaultRiderPoints,
        rider_5: defaultRiderPoints,
        rider_6: defaultRiderPoints,
        rider_7: defaultRiderPoints,
        rider_8: defaultRiderPoints
    })

    const [away, setAway] = useState<ITeamPoints>({
        team_id: '',
        rider_1: defaultRiderPoints,
        rider_2: defaultRiderPoints,
        rider_3: defaultRiderPoints,
        rider_4: defaultRiderPoints,
        rider_5: defaultRiderPoints,
        rider_6: defaultRiderPoints,
        rider_7: defaultRiderPoints,
        rider_8: defaultRiderPoints
    })

    const [addRoundDialogOpen, setAddRoundDialogOpen] = useState<boolean>(false);

    const handleOpen = () => {
        setAddRoundDialogOpen(true);
    }

    const handleClose = () => {
        setAddRoundDialogOpen(false);
        setRoundCreate(defaultRoundCreate);
    }

    const [number, setNumber] = useState<number>(0)

    const handleOnChangeSelectClub = (homeAway: string) => (event) => {
        event.persist();
        if(event.target) {
            if(homeAway === 'home'){
                setHome((prevState: ITeamPoints) => ({
                    ...prevState,
                    team_id: event.target.value
                }));
            }
            else{
                setAway((prevState: ITeamPoints) => ({
                    ...prevState,
                    team_id: event.target.value
                }));
            }
        };
    }

    const handleOnChangeSelectRider = (number: string, homeAway: string) => (
        event
    ) => {
        event.persist();
        const rider = parseInt(number.slice(-1));
        if(event.target) {
            if(homeAway === 'home'){
                switch(rider){
                    case 1:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: home.rider_1.points}
                        }));
                        break;
                    case 2:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: home.rider_2.points}
                        }));
                        break;
                    case 3:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: home.rider_3.points}
                        }));
                        break;
                    case 4:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: home.rider_4.points}
                        }));
                        break;
                    case 5:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: home.rider_5.points}
                        }));
                        break;
                    case 6:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: home.rider_6.points}
                        }));
                        break;
                    case 7:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: home.rider_7.points}
                        }));
                        break;
                    case 8:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: home.rider_8.points}
                        }));
                        break;
                    default:
                        break;
                }
            }
            else{
                switch(rider){
                    case 1:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: away.rider_1.points}
                        }));
                        break;
                    case 2:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: away.rider_2.points}
                        }));
                        break;
                    case 3:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: away.rider_3.points}
                        }));
                        break;
                    case 4:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: away.rider_4.points}
                        }));
                        break;
                    case 5:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: away.rider_5.points}
                        }));
                        break;
                    case 6:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: away.rider_6.points}
                        }));
                        break;
                    case 7:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: away.rider_7.points}
                        }));
                        break;
                    case 8:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [number]: {_id: event.target.value, points: away.rider_8.points}
                        }));
                        break;
                    default:
                        break;
                }
            }
        };
    }

    const handleOnChangeSelectRound = () => (
        event
    ) => {
        event.persist();
        if(event.target) {
            if(event.target.value == "New"){
                handleOpen();
            }
            else{
                setNumber(event.target.value)
            }
        };
    }

    const handleOnChangePoints = (rider: string, homeAway: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.persist();
        const number = parseInt(rider.slice(-1));
        if(event.target) {
            if(homeAway === 'home'){
                switch(number){
                    case 1:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: home.rider_1._id ,points: event.target.value}
                        }));
                        break;
                    case 2:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: home.rider_2._id ,points: event.target.value}
                        }));
                        break;
                    case 3:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: home.rider_3._id ,points: event.target.value}
                        }));
                        break;
                    case 4:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: home.rider_4._id ,points: event.target.value}
                        }));
                        break;
                    case 5:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: home.rider_5._id ,points: event.target.value}
                        }));
                        break;
                    case 6:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: home.rider_6._id ,points: event.target.value}
                        }));
                        break;
                    case 7:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: home.rider_7._id ,points: event.target.value}
                        }));
                        break;
                    case 8:
                        setHome((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: home.rider_8._id ,points: event.target.value}
                        }));
                        break;
                    default:
                        break
                }
            }
            else{
                switch(number){
                    case 1:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: away.rider_1._id ,points: event.target.value}
                        }));
                        break;
                    case 2:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: away.rider_2._id ,points: event.target.value}
                        }));
                        break;
                    case 3:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: away.rider_3._id ,points: event.target.value}
                        }));
                        break;
                    case 4:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: away.rider_4._id ,points: event.target.value}
                        }));
                        break;
                    case 5:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: away.rider_5._id ,points: event.target.value}
                        }));
                        break;
                    case 6:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: away.rider_6._id ,points: event.target.value}
                        }));
                        break;
                    case 7:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: away.rider_7._id ,points: event.target.value}
                        }));
                        break;
                    case 8:
                        setAway((prevState: ITeamPoints) => ({
                            ...prevState,
                            [rider]: {_id: away.rider_8._id ,points: event.target.value}
                        }));
                        break;
                    default:
                        break
                }
            }
        };
    }

    const handleOnChangeRoundForm = () => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.persist();
        if(event.target) {
            if(event.target.value === ""){
                setRoundCreate((prevState: IRoundCreate) => ({
                    ...prevState,
                    number: 0
                }));
            }
            else{
            setRoundCreate((prevState: IRoundCreate) => ({
                ...prevState,
                number: parseInt(event.target.value)
            }));
        }
        };
    }

    const handleDateBeginOnChange = date => {
        setRoundCreate((prevState: IRoundCreate) => ({
            ...prevState,
            startDate: date
        }));
    };

    const handleDateEndOnChange = date => {
        setRoundCreate((prevState: IRoundCreate) => ({
            ...prevState,
            endDate: date
        }));
    };

    const handleOnSubmitRound = (event: React.FormEvent) => {
        event.preventDefault();
        const validationResponse = validateRoundData(roundCreate);
        if(validationResponse.error){
            setValidatedRound(() => defaultValidatedRound);
            validationResponse.error.details.forEach(
                (errorItem: ValidationErrorItem): any => {
                    console.log(errorItem.message);
                    setValidatedRound((prevState: IValidatedRound) => {
                        return {
                            ...prevState,
                            [errorItem.path[0]]: {
                                message: errorItem.message,
                                error: true
                            }
                        };
                    });
                }
            );
        } else {
            addNewRound();
            setTimeout(() => {
                handleClose()
            },2000)
        }
    }

    const generateRounds = () => {
        return rounds.map((round, index) => {
            return <MenuItem key={index} value={round.number.toString()}>Runda {round.number}</MenuItem>
        })
    }

    const addNewRound = async () => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/rounds',
                roundCreate,
                options
            );
            addNotification("Sukces", "Poprawnie dodano rundę", "success", 2000);
            /*setRounds(rounds.concat({
                roundCreate
            }))*/
            setTimeout(() => {
                window.location.reload(false);
            }, 2000);
            setRoundCreate(defaultRoundCreate)
        } catch (e) {
            console.log(e.response);
            if (e.response.statusText == 'Unauthorized') {
                addNotification('Błąd', 'Sesja wygasła', 'danger', 3000);
                setTimeout(() => {
                    push('/login');
                }, 3000);
            } else {
                addNotification(
                    'Błąd',
                    'Nie udało się dodać rundy z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in adding rounds');
        }
    }

    const getRounds = async () => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/rounds',
                options
            );
            setRounds([]);
            /*data.map((round, index) => {
                setRounds(
                    rounds.concat({
                        startDate: round.startDate,
                        endDate: round.endDate,
                        number: round.number
                    })
                );
            });*/
            setRounds(data);
        } catch (e) {
            console.log(e.response);
            if (e.response.statusText == 'Unauthorized') {
                addNotification('Błąd', 'Sesja wygasła', 'danger', 3000);
                setTimeout(() => {
                    push('/login');
                }, 3000);
            } else {
                addNotification(
                    'Błąd',
                    'Nie udało się pobrać rund z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in getting rounds');
        }
    }

    const selectClubs = (homeAway) => {
        if(homeAway === 'home'){
            return clubs.filter(filtered => filtered.id !== away.team_id).map((club, index) => {
                return <MenuItem key={index} value={club.id}>{club.name}</MenuItem>
            })
        } else {
            return clubs.filter(filtered => filtered.id !== home.team_id).map((club, index) => {
                return <MenuItem key={index} value={club.id}>{club.name}</MenuItem>
            })
        }
    }

    const isU21 = date => {
        if(new Date().getFullYear() - new Date(date).getFullYear() < 22){
            return true
        } else {
           return false
        }
    }

    const isU23 = date => {
        console.log(new Date().getFullYear() - new Date(date).getFullYear() < 24)
        if(new Date().getFullYear() - new Date(date).getFullYear() < 24){
            return true
        } else {
           return false
        }
    }

    const isChosen = (id, number, homeAway) => {
        if(homeAway == 'home'){
            switch(number){
                case 1:
                    if(id === home.rider_2._id || id === home.rider_3._id || id === home.rider_4._id || id === home.rider_5._id || id === home.rider_6._id || id === home.rider_7._id || id === home.rider_8._id){
                        return true
                    }
                case 2:
                    if(id === home.rider_1._id || id === home.rider_3._id || id === home.rider_4._id || id === home.rider_5._id || id === home.rider_6._id || id === home.rider_7._id || id === home.rider_8._id){
                        return true
                    }
                case 3:
                    if(id === home.rider_2._id || id === home.rider_1._id || id === home.rider_4._id || id === home.rider_5._id || id === home.rider_6._id || id === home.rider_7._id || id === home.rider_8._id){
                        return true
                    }
                case 4:
                    if(id === home.rider_2._id || id === home.rider_3._id || id === home.rider_1._id || id === home.rider_5._id || id === home.rider_6._id || id === home.rider_7._id || id === home.rider_8._id){
                        return true
                    }
                case 5:
                    if(id === home.rider_2._id || id === home.rider_3._id || id === home.rider_4._id || id === home.rider_1._id || id === home.rider_6._id || id === home.rider_7._id || id === home.rider_8._id){
                        return true
                    }
                case 6:
                    if(id === home.rider_2._id || id === home.rider_3._id || id === home.rider_4._id || id === home.rider_5._id || id === home.rider_1._id || id === home.rider_7._id || id === home.rider_8._id){
                        return true
                    }
                case 7:
                    if(id === home.rider_2._id || id === home.rider_3._id || id === home.rider_4._id || id === home.rider_5._id || id === home.rider_6._id || id === home.rider_1._id || id === home.rider_8._id){
                        return true
                    }
                case 8:
                    if(id === home.rider_2._id || id === home.rider_3._id || id === home.rider_4._id || id === home.rider_5._id || id === home.rider_6._id || id === home.rider_7._id || id === home.rider_1._id){
                        return true
                    }
                default:
                    break;
            }
            return false;
        } else {
            switch(number){
                case 1:
                    if(id === away.rider_2._id || id === away.rider_3._id || id === away.rider_4._id || id === away.rider_5._id || id === away.rider_6._id || id === away.rider_7._id || id === away.rider_8._id){
                        return true
                    }
                case 2:
                    if(id === away.rider_1._id || id === away.rider_3._id || id === away.rider_4._id || id === away.rider_5._id || id === away.rider_6._id || id === away.rider_7._id || id === away.rider_8._id){
                        return true
                    }
                case 3:
                    if(id === away.rider_2._id || id === away.rider_1._id || id === away.rider_4._id || id === away.rider_5._id || id === away.rider_6._id || id === away.rider_7._id || id === away.rider_8._id){
                        return true
                    }
                case 4:
                    if(id === away.rider_2._id || id === away.rider_3._id || id === away.rider_1._id || id === away.rider_5._id || id === away.rider_6._id || id === away.rider_7._id || id === away.rider_8._id){
                        return true
                    }
                case 5:
                    if(id === away.rider_2._id || id === away.rider_3._id || id === away.rider_4._id || id === away.rider_1._id || id === away.rider_6._id || id === away.rider_7._id || id === away.rider_8._id){
                        return true
                    }
                case 6:
                    if(id === away.rider_2._id || id === away.rider_3._id || id === away.rider_4._id || id === away.rider_5._id || id === away.rider_1._id || id === away.rider_7._id || id === away.rider_8._id){
                        return true
                    }
                case 7:
                    if(id === away.rider_2._id || id === away.rider_3._id || id === away.rider_4._id || id === away.rider_5._id || id === away.rider_6._id || id === away.rider_1._id || id === away.rider_8._id){
                        return true
                    }
                case 8:
                    if(id === away.rider_2._id || id === away.rider_3._id || id === away.rider_4._id || id === away.rider_5._id || id === away.rider_6._id || id === away.rider_7._id || id === away.rider_1._id){
                        return true
                    }
                default:
                    break;
            }
            return false;
        }
    }

    const selectRiders = (clubId, number, homeAway) => {
        if(number === 8){
            return riders.filter(filtered => filtered.clubId === clubId && isU23(filtered.dateOfBirth)/* &&
            !isChosen(filtered.id, 8, homeAway)*/).map((rider, index) => {
                return <MenuItem key={index} value={rider.id}>{rider.firstName} {rider.lastName}</MenuItem>
            })
        } else if(number === 6 || number === 7 ) {
            return riders.filter(filtered => filtered.clubId === clubId && isU21(filtered.dateOfBirth) && 
            !filtered.isForeigner/* && (!isChosen(filtered.id, 7, homeAway) || !isChosen(filtered.id, 6, homeAway))*/).map((rider, index) => {
                return <MenuItem key={index} value={rider.id}>{rider.firstName} {rider.lastName}</MenuItem>
            })
        } else {
            return riders.filter(filtered => filtered.clubId == clubId/* &&
                (!isChosen(filtered.id, 1, homeAway) || !isChosen(filtered.id, 2, homeAway) || !isChosen(filtered.id, 3, homeAway) || !isChosen(filtered.id, 4, homeAway) || !isChosen(filtered.id, 5, homeAway))*/).map((rider, index) => {
                return <MenuItem key={index} value={rider.id}>{rider.firstName} {rider.lastName}</MenuItem>
            })
        }
    }

    useEffect(() => {
        getRounds();
        getClubs();
        getRiders();
    }, [])

    return(
        <>
            <div className="add-match">
                <div className="add-match__background"/>
                <Paper className="add-match__box">
                    <Typography variant="h2" className="add-match__header">
                        Dodaj nowy mecz
                    </Typography>
                    <Divider/>
                    <br/>
                    <div className="add-match__round-div">
                        <InputLabel id="roundLabel">Kolejka:</InputLabel>
                        <Select labelId="roundLabel" className="add-match__round-select" value={number || ''} onChange={handleOnChangeSelectRound()}>
                            <MenuItem value="New">Dodaj nową kolejkę</MenuItem>
                            {generateRounds()}
                        </Select>
                    </div>
                    <Dialog open={addRoundDialogOpen} onClose={handleClose} className="number-dialog">
                        <DialogTitle>
                            <div className="number-dialog__header">
                                <Typography variant="h4" className="number-dialog__title">
                                    Dodawanie kolejki
                                </Typography>
                                <IconButton onClick={handleClose} className="number-dialog__fix">
                                    <FiX />
                                </IconButton>
                            </div>
                        </DialogTitle>
                        <DialogContent dividers>
                            <form className="number-dialog__form">
                                <Grid container>
                                    <Grid item xs={7} className="number-dialog__form-fields">
                                        <FormControl className="number-dialog__form-field">
                                            <TextField
                                                label="Numer kolejki"
                                                required
                                                autoComplete="number"
                                                value={roundCreate.number.toString()}
                                                error={validatedRound.number.error}
                                                helperText={validatedRound.number.message}
                                                onChange={handleOnChangeRoundForm()}
                                            />
                                        </FormControl>
                                        <br/>
                                        <FormControl className="number-dialog__form-field-date">
                                            Data rozpoczęcia kolejki:
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    margin="normal"
                                                    id="date-picker-dialog-1"
                                                    format="dd/MM/yyyy"
                                                    value={roundCreate.startDate}
                                                    onChange={handleDateBeginOnChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date'
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </FormControl>
                                        <br/>
                                        <FormControl className="number-dialog__form-field-date">
                                            Data zakończenia kolejki:
                                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                                <KeyboardDatePicker
                                                    margin="normal"
                                                    id="date-picker-dialog-2"
                                                    format="dd/MM/yyyy"
                                                    value={roundCreate.endDate}
                                                    onChange={handleDateEndOnChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date'
                                                    }}
                                                />
                                            </MuiPickersUtilsProvider>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            className="number-dialog__button"
                                            onClick={handleOnSubmitRound}
                                        >
                                            Dodaj
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </DialogContent>
                    </Dialog>
                    <br/>
                    <div className="add-match__away-div">
                        AWAY
                        <br/>
                        <Select className="add-match__team-select" value={away.team_id || ''} onChange={handleOnChangeSelectClub('away')}> 
                            {selectClubs('away')}
                        </Select>
                        <br/>
                        <div className="add-match__rider-div">
                            1.
                            <Select className="add-match__rider-select" value={away.rider_1._id || ''} onChange={handleOnChangeSelectRider('rider_1', 'away')}>
                                {selectRiders(away.team_id, 1, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_1.points || ''} onChange={handleOnChangePoints('rider_1', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            2.
                            <Select className="add-match__rider-select" value={away.rider_2._id || ''} onChange={handleOnChangeSelectRider('rider_2', 'away')}>
                            {selectRiders(away.team_id, 2, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_2.points || ''} onChange={handleOnChangePoints('rider_2', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            3.
                            <Select className="add-match__rider-select" value={away.rider_3._id || ''} onChange={handleOnChangeSelectRider('rider_3', 'away')}>
                            {selectRiders(away.team_id, 3, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_3.points || ''} onChange={handleOnChangePoints('rider_3', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            4.
                            <Select className="add-match__rider-select" value={away.rider_4._id || ''} onChange={handleOnChangeSelectRider('rider_4', 'away')}>
                            {selectRiders(away.team_id, 4, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_4.points || ''} onChange={handleOnChangePoints('rider_4', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            5.
                            <Select className="add-match__rider-select" value={away.rider_5._id || ''} onChange={handleOnChangeSelectRider('rider_5', 'away')}>
                            {selectRiders(away.team_id, 5, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_5.points || ''} onChange={handleOnChangePoints('rider_5', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            6.
                            <Select className="add-match__rider-select" value={away.rider_6._id || ''} onChange={handleOnChangeSelectRider('rider_6', 'away')}>
                            {selectRiders(away.team_id, 6, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_6.points || ''} onChange={handleOnChangePoints('rider_6', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            7.
                            <Select className="add-match__rider-select" value={away.rider_7._id || ''} onChange={handleOnChangeSelectRider('rider_7', 'away')}>
                            {selectRiders(away.team_id, 7, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_7.points || ''} onChange={handleOnChangePoints('rider_7', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            8.
                            <Select className="add-match__rider-select" value={away.rider_8._id || ''} onChange={handleOnChangeSelectRider('rider_8', 'away')}>
                            {selectRiders(away.team_id, 8, 'away')}
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_8.points || ''} onChange={handleOnChangePoints('rider_8', 'away')}/>
                        </div>
                    </div>
                    <div className="add-match__home-div">
                        HOME
                        <br/>
                        <Select className="add-match__team-select" value={home.team_id} onChange={handleOnChangeSelectClub('home')}>
                            {selectClubs('home')}
                        </Select>
                        <br/>
                        <div className="add-match__rider-div">
                            9.
                            <Select className="add-match__rider-select" value={home.rider_1._id || ''} onChange={handleOnChangeSelectRider('rider_1', 'home')}>
                            {selectRiders(away.team_id, 1, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={home.rider_1.points || ''} onChange={handleOnChangePoints('rider_1', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            10.
                            <Select className="add-match__rider-select" value={home.rider_2._id || ''} onChange={handleOnChangeSelectRider('rider_2', 'home')}>
                            {selectRiders(away.team_id, 2, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={home.rider_2.points || ''} onChange={handleOnChangePoints('rider_2', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            11.
                            <Select className="add-match__rider-select" value={home.rider_3._id || ''} onChange={handleOnChangeSelectRider('rider_3', 'home')}>
                            {selectRiders(away.team_id, 3, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={home.rider_3.points || ''} onChange={handleOnChangePoints('rider_3', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            12.
                            <Select className="add-match__rider-select" value={home.rider_4._id || ''} onChange={handleOnChangeSelectRider('rider_4', 'home')}>
                            {selectRiders(away.team_id, 4, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={home.rider_4.points || ''} onChange={handleOnChangePoints('rider_4', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            13.
                            <Select className="add-match__rider-select" value={home.rider_5._id || ''} onChange={handleOnChangeSelectRider('rider_5', 'home')}>
                            {selectRiders(away.team_id, 5, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={home.rider_5.points || ''} onChange={handleOnChangePoints('rider_5', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            14.
                            <Select className="add-match__rider-select" value={home.rider_6._id || ''} onChange={handleOnChangeSelectRider('rider_6', 'home')}>
                            {selectRiders(away.team_id, 6, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={home.rider_6.points || ''} onChange={handleOnChangePoints('rider_6', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            15.
                            <Select className="add-match__rider-select" value={home.rider_7._id || ''} onChange={handleOnChangeSelectRider('rider_7', 'home')}>
                            {selectRiders(away.team_id, 7, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={home.rider_7.points || ''} onChange={handleOnChangePoints('rider_7', 'home')}/>
                        </div>
                        <div className="add-match__rider-div">
                            16.
                            <Select className="add-match__rider-select" value={home.rider_8._id || ''} onChange={handleOnChangeSelectRider('rider_8', 'home')}>
                            {selectRiders(away.team_id, 8, 'home')}
                            </Select>
                            <TextField className="add-match__rider-points" value={home.rider_8.points || ''} onChange={handleOnChangePoints('rider_8', 'home')}/>
                        </div>
                    </div>
                    <br/>
                    <Button className="add-match__submit-button">
                        Dodaj
                    </Button>
                </Paper>
            </div>
        </>
    )
}

export default AddMatch;