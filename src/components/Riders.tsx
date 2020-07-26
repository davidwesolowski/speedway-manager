import React, { FunctionComponent, useState } from 'react';
import {
	Paper,
	Typography,
	Divider,
	TextField,
	IconButton,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	FormControl,
	Grid,
	InputAdornment
} from '@material-ui/core';
import {FiPlus, FiX, FiTarget} from 'react-icons/fi';
import axios from 'axios';
import validateRiderData from '../validation/validateRiderData';
import { ValidationErrorItem } from '@hapi/joi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Alert from '@material-ui/lab/Alert';

interface IRider{
    firstName: string;
    lastName: string;
    nickname: string;
    dateOfBirth: Date;
    club: string;
}

interface IValidatedData{
    firstName: {
        message: string;
        error: boolean;
    };
    lastName: {
        message: string;
        error: boolean;
    };
    nickname: {
        message: string;
        error: boolean;
    };
    dateOfBirth: {
        message: string;
        error: boolean;
    };
    club: {
        message: string;
        error: boolean;
    };
}

const defaultValidatedData = {
    firstName: {
        message: '',
        error: false
    },
    lastName: {
        message: '',
        error: false
    },
    nickname: {
        message: '',
        error: false
    },
    dateOfBirth: {
        message: '',
        error: false
    },
    club: {
        message: '',
        error: false
    }
};

const defaultRiderData = {
    firstName: '',
    lastName: '',
    nickname: '',
    dateOfBirth: new Date(1990,1,1),
    club: ''
};

const Riders: FunctionComponent = () => {
    const [riderData, setRiderData] = useState<IRider>(
        defaultRiderData
    );
    const [validatedData, setValidatedData] = useState<IValidatedData>(
        defaultValidatedData
    );
    const [addRiderSuccess, setAddRiderSuccess] = useState<boolean>(false);
    const [addRiderError, setAddRiderError] = useState<boolean>(false);
    const [showDialog, setShowDialog] = useState<boolean>(false);

    const handleOpen = () => setShowDialog(true);
    const handleClose = () => {
        setValidatedData(defaultValidatedData);
        setShowDialog(false);
        setRiderData(defaultRiderData);
    };

    const handleOnChange = (name: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.persist();
        if (event.target) {
            setRiderData((prevState: IRider) => ({
                ...prevState,
                [name]: event.target.value
            }));
        }
    };

    const handleDateOnChange = date => {
        setRiderData((prevState: IRider) => ({
            ...prevState,
            dateOfBirth: date
        }));
    };

    const handleOnChangeClub = sclub => {
        setRiderData((prevState: IRider) => ({
            ...prevState,
            club: sclub
        }));
    };

    const addRider = async (riderData: IRider) => {
        try {
            const {
                data: { access_token }
            } = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/auth/rider',
                riderData
            );

            setAddRiderError(false);
            setAddRiderSuccess(true);
        } catch (e) {
            setAddRiderSuccess(false);
            setAddRiderError(true);
            throw new Error('Error in adding new rider!');
        }
    };

    const handleOnSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const validationResponse = validateRiderData(riderData);
        if (validationResponse.error) {
            setValidatedData(() => defaultValidatedData);
            validationResponse.error.details.forEach(
                (errorItem: ValidationErrorItem): any => {
                    setValidatedData((prevState: IValidatedData) => {
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
            const {firstName, lastName, nickname, dateOfBirth, club} = riderData;
            addRider({firstName, lastName, nickname, dateOfBirth, club});
        }
    };

    return(
        <>
            <div className="riders">
                <div className="riders__background"></div>
                <Paper className="riders__box">
                    <Typography variant="h2" className="riders__header">
                        Zawodnicy
                    </Typography>
                    <Divider />
                    <IconButton className="riders__fiplus" onClick={handleOpen}>
                        <FiPlus />
                    </IconButton>
                </Paper>
            </div>
            <Dialog open={showDialog} onClose={handleClose} className="dialog">
                <DialogTitle>
                    <div className="dialog__header">
                        <Typography variant="h4" className="dialog__title">
                            Dodawanie zawodnika
                            <IconButton onClick={handleClose} className="riders__fix">
                                <FiX />
                            </IconButton>
                        </Typography>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <form className="dialog__form" onSubmit={handleOnSubmit}>
                        <Grid container>
                            <Grid item xs={7} className="dialog__form_fields">
                                <FormControl className="dialog__form_field">
                                    <TextField
                                        label="Imię"
                                        required
                                        autoComplete="firstName"
                                        value={riderData.firstName}
                                        error={validatedData.firstName.error}
                                        helperText={
                                            validatedData.firstName.message
                                        }
                                        onChange={handleOnChange('firstName')}
                                    />
                                </FormControl>
                                <FormControl className="dialog__form_field">
                                    <TextField
                                        label="Nazwisko"
                                        required
                                        autoComplete="lastName"
                                        value={riderData.lastName}
                                        error={validatedData.lastName.error}
                                        helperText={validatedData.lastName.message}
                                        onChange={handleOnChange('lastName')}
                                    />
                                </FormControl>
                                <FormControl className="dialog__form_field">
                                    <TextField
                                        label="Przydomek"
                                        autoComplete="nickname"
                                        value={riderData.nickname}
                                        error={validatedData.nickname.error}
                                        helperText={validatedData.nickname.message}
                                        onChange={handleOnChange('nickname')}
                                    />
                                </FormControl>
                                <FormControl className="dialog__form_field_date">
                                    Data urodzenia:
                                    <DatePicker selected={riderData.dateOfBirth} onChange={handleDateOnChange} className="dialog__choose_list"/>
                                </FormControl>
                                <FormControl className="dialog__form_field_club">
                                    Klub:
                                    <select value={riderData.club} onChange={handleOnChangeClub} className="dialog__choose_list">
                                        <option value="Fogo Unia Leszno">Fogo Unia Leszno</option>
                                        <option value="forBet Włókniarz Częstochowa">forBet Włókniarz Częstochowa</option>
                                        <option value="RM Solar Falubaz Zielona Góra">RM Solar Falubaz Zielona Góra</option>
                                        <option value="Motor Lublin">Motor Lublin</option>
                                        <option value="Betard Sparta Wrocław">Betard Sparta Wrocław</option>
                                        <option value="MRGARDEN GKM Grudziądz">MRGARDEN GKM Grudziądz</option>
                                        <option value="Moje Bermudy Stal Gorzów">Moje Bermudy Stal Gorzów</option>
                                        <option value="PGG ROW Rybnik">PGG ROW Rybnik</option>
                                    </select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
								<Button
									className="btn dialog__form_button"
									type="submit"
								>
									Dodaj
								</Button>
							</Grid>
							<Grid item xs={12}>
								{addRiderSuccess && (
									<Alert
										severity="success"
										variant="outlined"
									>
										Dodawanie zawodnika zakończone powodzeniem!
									</Alert>
								)}
								{addRiderError && (
									<Alert severity="error" variant="outlined">
										Dodawanie zawodnika zakończone niepowodzeniem!
									</Alert>
								)}
							</Grid>
                        </Grid>
                    </form> 
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Riders;