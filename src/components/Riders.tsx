import React, { FunctionComponent, useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import {
	Paper,
	Typography,
	Divider,
	TextField,
	IconButton,
	Button
} from '@material-ui/core';
import {FiPlus} from 'react-icons/fi';
import axios from 'axios';

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

const Riders: FunctionComponent<RouteComponentProps> = ({
    history: { push }
}) => {
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

    return(
        <div className="riders">
            <div className="riders__background"></div>
            <Paper className="riders__box">
                <Typography variant="h2" className="riders__header">
                    Dodawanie zawodnika
                </Typography>
                <Divider />
                <Typography variant="h3">
                    <FiPlus className="riders__fiplus" />
                </Typography>
            </Paper>
        </div>
    )
};

export default Riders;