import { ValidationErrorItem } from '@hapi/joi';
import { Button, CircularProgress, Dialog, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { FiPlus, FiX, FiXCircle } from 'react-icons/fi';
import { RouteComponentProps } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { setUser } from '../actions/userActions';
import addNotification from '../utils/addNotification';
import { checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import validateUserLeagueData from '../validation/validateUserLeagueData';
import { useStateValue } from './AppProvider';

interface IValidatedData{
    name: {
        message: string;
        error: boolean;
    };
    mainLeague: {
        message: string;
        error: boolean;
    }
}

const UserRankingLeagues: FunctionComponent<RouteComponentProps> = ({history: { push }}) => {

    const {
        setLoggedIn,
		dispatchUserData,
		userData,
    } = useStateValue();

    const fetchUserData = async () => {
        const accessToken = getToken();
		const options = {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		};
        try {
            const {
                data: { username, email, avatarUrl }
            } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/users/self',
                options
            );
            dispatchUserData(setUser({ username, email, avatarUrl }));
            setLoggedIn(true);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            }
        }
    };

    const defaultValidatedData = {
        name: {
            message: '',
            error: false
        },
        mainLeague: {
            message: '',
            error: false
        }
    }

    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [addUserLeagueName, setAddUserLeagueName] = useState<string>('');
    const [owns, setOwns] = useState([]);
    const [participates, setParticipates] = useState([]);
    const [addUserLeagueMainLeague, setAddUserLeagueMainLeague] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const [validatedData, setValidatedData] = useState<IValidatedData>(defaultValidatedData);

    const [tempLeagues, setTempLeagues] = useState([
        {name: "Liga 1", mainLeague: "Glowna 1", owner: "Wlasciciel 1"},
        {name: "Liga 2", mainLeague: "Glowna 2", owner: "Wlasciciel 2"},
        {name: "Liga 3", mainLeague: "Glowna 3", owner: "Wlasciciel 3"}
    ])

    const handleOpenDialog = () => {
        setOpenDialog(true);
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAddUserLeagueName('');
        setAddUserLeagueMainLeague('');
    }

    //Jedna lub dwie funkcje w zaleznosci od backendu
    const getUserLeagues = async () => {
        const accessToken = getToken();
        const options = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        };
        const { data } = await axios.get(
            'https://fantasy-league-eti.herokuapp.com/rankings',
            options
        );
        console.log(data);
        setOwns(data.owns);
        setParticipates(data.participates);
    }

    const addUserLeague = async () => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/rankings',
                {name: addUserLeagueName},
                options
            );
            addNotification(
				'Sukces!',
				'Udało się dodać ranking!',
				'success',
				1000
			);
			setTimeout(() => {
				window.location.reload(false);
			}, 1000);
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
                    'Nie udało się pobrać lig z bazy',
                    'danger',
                    3000
                );
            }
            throw new Error('Error in getting leagues');
        }
    }

    const deleteUserLeague = async (id) => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.delete(
                `https://fantasy-league-eti.herokuapp.com/rankings/${id}`,
                options
            );
            addNotification(
				'Sukces!',
				'Udało się usunąć ranking!',
				'success',
				1000
			);
			setTimeout(() => {
				window.location.reload(false);
			}, 1000);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
                addNotification(
                    'Błąd',
                    'Nie udało się usunąć ligi z bazy',
                    'danger',
                    3000
                );
            }
        }
    }

    const renderOwnedTableData = () => {
        return owns.map((league, index) => {
            return(
                <TableRow
					key={index}
				>
                    <TableCell>{league.name}</TableCell>
                    <TableCell className="table-X">
						<IconButton
							onClick={(event: React.MouseEvent<HTMLElement>) => {
								deleteUserLeague(league._id);
							}}
							className="delete-button"
						>
							<FiXCircle />
						</IconButton>
					</TableCell>
                </TableRow>
            )
        })
    }

    const renderParticipatedTableData = () => {
        return participates.map((league, index) => {
            return(
                <TableRow
					key={index}
				>
                    <TableCell>{league.name}</TableCell>
                    <TableCell className="table-X"></TableCell>
                </TableRow>
            )
        })
    }

    const generateTable = () => {
        return(
            <div className='user-leagues-table'>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>NAZWA</TableCell>
                                <TableCell>USUŃ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderOwnedTableData()}
                            {renderParticipatedTableData()}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }

    const handleOnChangeName = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        if(event.target){
            setAddUserLeagueName(event.target.value);
        }
    }

    const handleOnSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("SUBMIT");
        const validationResponse = validateUserLeagueData({name: addUserLeagueName, mainLeague: addUserLeagueMainLeague});
        if (validationResponse.error){
            setValidatedData(() => defaultValidatedData);
            validationResponse.error.details.forEach(
                (errorItem: ValidationErrorItem): any => {
                    console.log(errorItem.message);
                    setValidatedData((prevState: IValidatedData) => {
                        return{
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
            addUserLeague();
        }
    }

    const handleOnChangeMainLeague = () => event => {
        event.persist();
        if(event.target){
            setAddUserLeagueMainLeague(event.target.value);
        }
    }

    useEffect(() => {
        setLoading(true);
        (async function () {
            try {
                await getUserLeagues();
                setLoading(false);
            } catch (e) {
                const {
                    response: { data }
                } = e;
                if (data.statusCode == 401) {
                    checkBadAuthorization(setLoggedIn, push);
                } else {
                    addNotification('Błąd', 'Nie udało się pobrać danych z bazy', 'danger', 1500);
                }
            }
        })();
    }, [])

    const generateDialog = () => {
        return(
            <>
                <div>
                    <Dialog open={openDialog} onClose={handleCloseDialog} className="user-leagues-dialog">
                        <DialogTitle>
                            <div className="user-leagues-dialog__header">
                                <Typography variant="h4" className="user-leagues-dialog__title">
                                    Dodawanie ligi
                                </Typography>
                                <IconButton
                                    onClick={handleCloseDialog}
                                    className="user-leagues-dialog__fix"
                                >
                                    <FiX />
                                </IconButton>
                            </div>
                        </DialogTitle>
                        <DialogContent dividers>
                            <form className="user-leagues-dialog__form" onSubmit={handleOnSubmit}>
                                <Grid container>
                                    <Grid item xs={7} className="user-leagues-dialog__fields">
                                        <FormControl className="user-leagues-dialog__text-field">
                                            <TextField
                                                label="Nazwa ligi"
                                                required
                                                autoComplete="league"
                                                value={addUserLeagueName}
                                                error={validatedData.name.error}
                                                helperText={validatedData.name.message}
                                                onChange={handleOnChangeName()}
                                            />
                                        </FormControl>
                                        {/* <FormControl className="user-leagues-dialog__select-field">
                                            Główna liga:
                                            <Select
                                                value={addUserLeagueMainLeague || ''}
                                                onChange={handleOnChangeMainLeague()}
                                            >
                                                <MenuItem value="Polska">Polska</MenuItem>
                                                <MenuItem value="Wielka Brytania">Wielka Brytania</MenuItem>
                                                <MenuItem value="Szwecja">Szwecja</MenuItem>
                                                <MenuItem value="Dania">Dania</MenuItem>
                                            </Select>
                                        </FormControl> */}
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            className="btn user-leagues-dialog__form_button"
                                            type="submit"
                                        >
                                            Dodaj
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </>
        )
    }

    useEffect(() => {
        if (!userData.username) fetchUserData();
    }, [])

    return(
        <>
            <div className="user-leagues">
                <div className="user-leagues__background"></div>
                <Paper className="user-leagues__box">
                    <Typography
                        variant="h2"
                        className="heading-1 user-leagues__heading"
                    >
                        Moje Ligi
                    </Typography>
                    <IconButton
                        onClick={handleOpenDialog}
                        className="user-leagues__fiplus"
                    >
                        <FiPlus />
                    </IconButton>
                    <Divider />
                    <br/>
                    {loading && (
                        <Grid container justify="center" alignItems="center">
                            <CircularProgress />
                        </Grid>
                    )}
                    <CSSTransition
                        in={owns.length > 0 || participates.length > 0}
                        timeout={300}
                        classNames="animationScaleUp"
                        unmountOnExit
                    >
                        <div>
                            {generateTable()}
                            {generateDialog()}
                        </div>
                    </CSSTransition>
                </Paper>
            </div>
        </>
    )
}

export default UserRankingLeagues;