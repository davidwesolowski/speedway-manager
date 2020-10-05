import { ValidationErrorItem } from '@hapi/joi';
import { Button, Dialog, DialogContent, DialogTitle, Divider, FormControl, Grid, IconButton, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@material-ui/core';
import axios from 'axios';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { FiPlus, FiX, FiXCircle } from 'react-icons/fi';
import { RouteComponentProps } from 'react-router-dom';
import { setUser } from '../actions/userActions';
import addNotification from '../utils/addNotification';
import { checkBadAuthorization } from '../utils/checkCookies';
import getToken from '../utils/getToken';
import validateLeagueData from '../validation/validateLeagueData';
import { useStateValue } from './AppProvider';

interface IValidatedData{
    name: {
        message: string;
        error: boolean;
    };
    country: {
        message: string;
        error: boolean;
    }
}

const Leagues: FunctionComponent<RouteComponentProps> = ({history: { push }}) => {

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

    const [leagues, setLeagues] = useState([]);
    const [addLeagueName, setAddLeagueName] = useState<string>('');
    const [addLeagueCountry, setAddLeagueCountry] = useState<string>('Polska');
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const defaultValidatedData = {
        name: {
            message: '',
            error: false
        },
        country: {
            message: '',
            error: false
        }
    }

    const [validatedData, setValidatedData] = useState<IValidatedData>(defaultValidatedData);

    const handleOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setAddLeagueCountry('Polska');
        setAddLeagueName('');
    }

    const [tempLeagues, setTempLeagues] = useState([
        {
            name: 'PGE Ekstraliga',
            country: "Polska"
        },
        {
            name: 'eWinner 1 liga żużlowa',
            country: 'Polska'
        },
        {
            name: '2 liga żużlowa',
            country: 'Polska'
        }
    ])

    const getLeagues = async () => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/leagues',
                options
            );
            setLeagues(data);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
                addNotification(
                    'Błąd',
                    'Nie udało się pobrać lig z bazy',
                    'danger',
                    3000
                );
            }
        }
    }

    const addLeague = async () => {
        try {
            const accessToken = getToken();
            const options = {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            };
            const { data } = await axios.post(
                'https://fantasy-league-eti.herokuapp.com/leagues',
                {
                    name: addLeagueName,
                    country: addLeagueCountry
                },
                options
            );
            addNotification(
				'Sukces!',
				'Udało się usunąć ligę!',
				'success',
				1000
			);
        } catch (e) {
            const {
                response: { data }
            } = e;
            if (data.statusCode == 401) {
                checkBadAuthorization(setLoggedIn, push);
            } else {
                addNotification(
                    'Błąd',
                    'Nie udało się dodać ligi do bazy',
                    'danger',
                    3000
                );
            }
        }
    }

    const deleteLeague = async (id) => {
        try {
			const accessToken = getToken();
			const options = {
				headers: {
					Authorization: `Bearer ${accessToken}`
				}
			};
			const { data } = await axios.delete(
				`https://fantasy-league-eti.herokuapp.com/leagues/${id}`,
				options
			);
			addNotification(
				'Sukces!',
				'Udało się usunąć ligę!',
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

    const renderTableData = () => {
        return leagues.map((league, index) => {
            return(
                <TableRow
					key={league._id}

				>
                    <TableCell>{league.name}</TableCell>
                    <TableCell>{league.country}</TableCell>
                    <TableCell className="table-X">
						<IconButton
							onClick={(event: React.MouseEvent<HTMLElement>) => {
								deleteLeague(league._id);
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

    const generateTable = () => {
        return(
            <div className='leagues-table'>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>NAZWA</TableCell>
                                <TableCell>KRAJ</TableCell>
                                <TableCell>USUŃ</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {renderTableData()}
                        </TableBody>
                    </Table>
                </TableContainer>
			</div>
        )
    }

    const handleOnChangeName = () => (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        if(event.target){
            setAddLeagueName(event.target.value);
        }
    }

    const handleOnChangeCountry = () => event => {
        event.persist();
        if(event.target){
            setAddLeagueCountry(event.target.value);
        }
    }

    const handleOnSubmit = (event: React.FormEvent) => {
        event.persist();
        const validationResponse = validateLeagueData({name: addLeagueName, country: addLeagueCountry});
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
            addLeague();
        }
    }

    useEffect(() => {
        getLeagues();
    }, [])

    const generateDialog = () => {
        return(
            <>
                <div>
                    <Dialog open={openDialog} onClose={handleCloseDialog} className="leagues-dialog">
                        <DialogTitle>
                            <div className="leagues-dialog__header">
                                <Typography variant="h4" className="leagues-dialog__title">
                                    Dodawanie ligi
                                </Typography>
                                <IconButton
                                    onClick={handleCloseDialog}
                                    className="leagues-dialog__fix"
                                >
                                    <FiX />
                                </IconButton>
                            </div>
                        </DialogTitle>
                        <DialogContent dividers>
                            <form className="leagues-dialog__form" onSubmit={handleOnSubmit}>
                                <Grid container>
                                    <Grid item xs={7} className="leagues-dialog__fields">
                                        <FormControl className="leagues-dialog__text-field">
                                            <TextField
                                                label="Nazwa ligi"
                                                required
                                                autoComplete="league"
                                                value={addLeagueName}
                                                error={validatedData.name.error}
                                                helperText={validatedData.name.message}
                                                onChange={handleOnChangeName()}
                                            />
                                        </FormControl>
                                        <FormControl className="leagues-dialog__select-field">
                                            Kraj:
                                            <Select
                                                value={addLeagueCountry || ''}
                                                onChange={handleOnChangeCountry()}
                                            >
                                                <MenuItem value="Polska">Polska</MenuItem>
                                                <MenuItem value="Wielka Brytania">Wielka Brytania</MenuItem>
                                                <MenuItem value="Szwecja">Szwecja</MenuItem>
                                                <MenuItem value="Dania">Dania</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            className="btn leagues-dialog__form_button"
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
            <div className="leagues">
                <div className="leagues__background"></div>
                <Paper className="leagues__box">
                    <Typography
                        variant="h2"
                        className="heading-1 leagues__heading"
                    >
                        Ligi
                    </Typography>
                    <IconButton
                        onClick={handleOpenDialog}
                        className="leagues__fiplus"
                    >
                        <FiPlus />
                    </IconButton>
                    <Divider />
                    <br/>
                    {generateTable()}
                    {generateDialog()}
                </Paper>
            </div>
        </>
    )
}

export default Leagues;