import React, { FunctionComponent, useState, useEffect } from 'react';
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
    Checkbox
} from '@material-ui/core';
import {FiPlus, FiX, FiTarget} from 'react-icons/fi';
import axios from 'axios';
import validateRiderData from '../validation/validateRiderData';
import { ValidationErrorItem } from '@hapi/joi';
import RidersList from "../components/RidersList";
import Cookies from 'universal-cookie';
import addNotification from '../utils/addNotification';
import { Link, RouteComponentProps } from 'react-router-dom';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';

interface IRider{
    first_name: string;
    last_name: string;
    nickname: string;
    date_of_birth: Date;
    isForeigner: boolean;
    ksm: number;
//   club: string;
}

interface IValidatedData{
    first_name: {
        message: string;
        error: boolean;
    };
    last_name: {
        message: string;
        error: boolean;
    };
    nickname: {
        message: string;
        error: boolean;
    };
    date_of_birth: {
        message: string;
        error: boolean;
    };
    ksm: {
        message: string;
        error: boolean;
    }
/*    club: {
        message: string;
        error: boolean;
    };*/
}

const defaultValidatedData = {
    first_name: {
        message: '',
        error: false
    },
    last_name: {
        message: '',
        error: false
    },
    nickname: {
        message: '',
        error: false
    },
    date_of_birth: {
        message: '',
        error: false
    },
    ksm: {
        message: '',
        error: false
    }
/*    club: {
        message: '',
        error: false
    }*/
};

const refreshPage = () => {
    window.location.reload(false);
  }

const defaultRiderData = {
    first_name: '',
    last_name: '',
    nickname: '',
    date_of_birth: new Date(2000,1,1),
    isForeigner: false,
    ksm: 2.50
 //   club: 'Fogo Unia Leszno'
};

const Riders: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {
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
            date_of_birth: date
        }));
    };

    const handleOnChangeClub = (name: string) => (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        event.persist();
        if (event.target) {
            setRiderData((prevState: IRider) => ({
                ...prevState,
                [name]: event.target.value
            }));
        }
    };

    const addRider = async (riderData: IRider) => {
        try {
            const cookies = new Cookies();
            const access_token = cookies.get("access_token");
            const options = {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            };
            const {
                data
            } = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/riders',
                riderData,
                options
            );
            addNotification("Sukces", "Poprawnie dodano zawodnika", "success", 1000);
            setValidatedData(defaultValidatedData);
            setRiderData(defaultRiderData); 
            setTimeout(() => {
                {handleClose()};
            }, 10);
            setTimeout(() => {
                {refreshPage()};
            }, 1000);
        } catch (e) {
            if(e.statusText == "Bad Request")
            {
                addNotification("Błąd!", "Podany zawodnik już istnieje w bazie!", "danger",1000);
                setTimeout(() => {
                }, 1000);
            }
            else if(e.statusText == "Unauthorized")
            {
                addNotification("Błąd!", "Twoja sesja wygasła", "danger", 1000);
                setTimeout(() => {
                    push('/login');
                }, 1000);
            }
            else
            {
                setAddRiderError(true);
                setAddRiderSuccess(false);
                addNotification("Błąd!", "Nie udało się dodać zawodnika!", "danger",1000);
                setTimeout(() => {
                    setAddRiderError(false);
                }, 1000);
            }
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
            const {first_name, last_name, nickname, date_of_birth, isForeigner, ksm} = riderData;
            addRider({first_name, last_name, nickname, date_of_birth, isForeigner, ksm});
 /*           const {firstName, lastName, nickname, dateOfBirth, club} = riderData;
            addRider({firstName, lastName, nickname, dateOfBirth, club});*/
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
                    <RidersList/>
                </Paper>
            </div>
            <Dialog open={showDialog} onClose={handleClose} className="dialog">
                <DialogTitle>
                    <div className="dialog__header">
                        <Typography variant="h4" className="dialog__title">
                            Dodawanie zawodnika
                        </Typography>
                        <IconButton onClick={handleClose} className="riders__fix">
                                <FiX />
                        </IconButton>
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
                                        autoComplete="first_name"
                                        value={riderData.first_name}
                                        error={validatedData.first_name.error}
                                        helperText={
                                            validatedData.first_name.message
                                        }
                                        onChange={handleOnChange('first_name')}
                                    />
                                </FormControl>
                                <FormControl className="dialog__form_field">
                                    <TextField
                                        label="Nazwisko"
                                        required
                                        autoComplete="last_name"
                                        value={riderData.last_name}
                                        error={validatedData.last_name.error}
                                        helperText={validatedData.last_name.message}
                                        onChange={handleOnChange('last_name')}
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
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <KeyboardDatePicker
                                            margin="normal"
                                            id="date-picker-dialog"
                                            format="dd/MM/yyyy"
                                            value={new Date(riderData.date_of_birth)}
                                            onChange={handleDateOnChange}
                                            KeyboardButtonProps={{
                                                'aria-label': 'change date'
                                            }}
                                        />
                                    </MuiPickersUtilsProvider>
                                </FormControl>
                                <br/>
                                <FormControl className="dialog__form_field">
                                    <TextField
                                        label="KSM"
                                        required
                                        autoComplete="ksm"
                                        value={riderData.ksm}
                                        error={validatedData.ksm.error}
                                        helperText={validatedData.ksm.message}
                                        onChange={handleOnChange('ksm')}
                                    />
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
                        </Grid>
                    </form> 
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Riders;

/*
<FormControl className="dialog__form_field_club">
    Klub:
    <select value={riderData.club} onChange={handleOnChangeClub('club')} className="dialog__choose_list">
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
*/