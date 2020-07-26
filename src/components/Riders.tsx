import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
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
import {FiPlus, FiX} from 'react-icons/fi';
import axios from 'axios';
import validateRiderData from '../validation/validateRiderData';
import { ValidationErrorItem } from '@hapi/joi';

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

const Riders: FunctionComponent = () => {
    const [riderData, setRiderData] = useState<IRider>({
        firstName: '',
        lastName: '',
        nickname: '',
        dateOfBirth: new Date(1900,1,1),
        club: ''
    });
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
                        </Typography>
                        <IconButton onClick={handleClose}>
                            <FiX />
                        </IconButton>
                    </div>
                </DialogTitle>
                <DialogContent dividers>
                    <form className="dialog__form" onSubmit={handleOnSubmit}>
                        <Grid container>
                            <Grid item xs={7} className="dialog__form_fields">
                                
                            </Grid>
                        </Grid>
                    </form> 
                </DialogContent>
            </Dialog>
        </>
    );
};

export default Riders;