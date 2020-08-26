import React, { FunctionComponent, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Paper, Typography, Divider, Button, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";

interface IRiderPoints{
    id: string;
    points: number;
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

const AddMatch: FunctionComponent<RouteComponentProps> = ({
    history: { push }
}) => {

    const defaultRiderPoints = {
        id: "",
        points: 0
    }

    const idRider = {
        id: "Mleko"
    }

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

    const [validatedPoints, setValidatedPoints] = useState<IValidatedPoints>(defaultValidatedPoints)

    const [home, setHome] = useState<ITeamPoints>({
        team_id: "",
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
        team_id: "",
        rider_1: defaultRiderPoints,
        rider_2: defaultRiderPoints,
        rider_3: defaultRiderPoints,
        rider_4: defaultRiderPoints,
        rider_5: defaultRiderPoints,
        rider_6: defaultRiderPoints,
        rider_7: defaultRiderPoints,
        rider_8: defaultRiderPoints
    })

    const [round, setRound] = useState<number>(0)

    const handleOnChangeSelectRider = (number: string, homeAway: string) => (
        event
    ) => {
        event.persist();
        if(event.target) {
            if(homeAway === 'home'){
                setHome((prevState: ITeamPoints) => ({
                    ...prevState,
                    [number]: {id: event.target.value}
                }));
            }
            else{
                setAway((prevState: ITeamPoints) => ({
                    ...prevState,
                    [number]: {id: event.target.value}
                }));
            }
        };
    }

    const handleOnChangePoints = (rider: string, homeAway: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.persist();
        if(event.target) {
            if(homeAway === 'home'){
                setHome((prevState: ITeamPoints) => ({
                    ...prevState,
                    [rider]: {points: event.target.value}
                }));
            }
            else{
                setAway((prevState: ITeamPoints) => ({
                    ...prevState,
                    [rider]: {points: event.target.value}
                }));
            }
        };
    }

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
                        <Select labelId="roundLabel" className="add-match__round-select" value={round} >
                            <MenuItem value="New">Dodaj nową kolejkę</MenuItem>
                        </Select>
                    </div>
                    <br/>
                    <div className="add-match__away-div">
                        AWAY
                        <br/>
                        <Select className="add-match__team-select" value={away.team_id}>
                            <MenuItem value="Away">Przyjezdni</MenuItem>
                        </Select>
                        <br/>
                        <div className="add-match__rider-div">
                            1.
                            <Select className="add-match__rider-select" value={away.rider_1.id} onChange={handleOnChangeSelectRider('rider_1', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_1.points} onChange={handleOnChangePoints('rider_1', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            2.
                            <Select className="add-match__rider-select" value={away.rider_2.id} onChange={handleOnChangeSelectRider('rider_2', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_2.points} onChange={handleOnChangePoints('rider_2', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            3.
                            <Select className="add-match__rider-select" value={away.rider_3.id} onChange={handleOnChangeSelectRider('rider_3', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_3.points} onChange={handleOnChangePoints('rider_3', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            4.
                            <Select className="add-match__rider-select" value={away.rider_4.id} onChange={handleOnChangeSelectRider('rider_4', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_4.points} onChange={handleOnChangePoints('rider_4', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            5.
                            <Select className="add-match__rider-select" value={away.rider_5.id} onChange={handleOnChangeSelectRider('rider_5', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_5.points} onChange={handleOnChangePoints('rider_5', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            6.
                            <Select className="add-match__rider-select" value={away.rider_6.id} onChange={handleOnChangeSelectRider('rider_6', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_6.points} onChange={handleOnChangePoints('rider_6', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            7.
                            <Select className="add-match__rider-select" value={away.rider_7.id} onChange={handleOnChangeSelectRider('rider_7', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_7.points} onChange={handleOnChangePoints('rider_7', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            8.
                            <Select className="add-match__rider-select" value={away.rider_8.id} onChange={handleOnChangeSelectRider('rider_8', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_8.points} onChange={handleOnChangePoints('rider_8', 'away')}/>
                        </div>
                    </div>
                    <div className="add-match__home-div">
                        HOME
                        <br/>
                        <Select className="add-match__team-select" value={home.team_id}>
                            <MenuItem value="Home">Gospodarze</MenuItem>
                        </Select>
                        <br/>
                        <div className="add-match__rider-div">
                            9.
                            <Select className="add-match__rider-select" value={away.rider_1.id} onChange={handleOnChangeSelectRider('rider_1', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_1.points} onChange={handleOnChangePoints('rider_1', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            10.
                            <Select className="add-match__rider-select" value={away.rider_2.id} onChange={handleOnChangeSelectRider('rider_2', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_2.points} onChange={handleOnChangePoints('rider_2', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            11.
                            <Select className="add-match__rider-select" value={away.rider_3.id} onChange={handleOnChangeSelectRider('rider_3', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_3.points} onChange={handleOnChangePoints('rider_3', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            12.
                            <Select className="add-match__rider-select" value={away.rider_4.id} onChange={handleOnChangeSelectRider('rider_4', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_4.points} onChange={handleOnChangePoints('rider_4', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            13.
                            <Select className="add-match__rider-select" value={away.rider_5.id} onChange={handleOnChangeSelectRider('rider_5', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_5.points} onChange={handleOnChangePoints('rider_5', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            14.
                            <Select className="add-match__rider-select" value={away.rider_6.id} onChange={handleOnChangeSelectRider('rider_6', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_6.points} onChange={handleOnChangePoints('rider_6', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            15.
                            <Select className="add-match__rider-select" value={away.rider_7.id} onChange={handleOnChangeSelectRider('rider_7', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_7.points} onChange={handleOnChangePoints('rider_7', 'away')}/>
                        </div>
                        <div className="add-match__rider-div">
                            16.
                            <Select className="add-match__rider-select" value={away.rider_8.id} onChange={handleOnChangeSelectRider('rider_8', 'away')}>
                                <MenuItem value="rider">Zawodnik</MenuItem>
                            </Select>
                            <TextField className="add-match__rider-points" value={away.rider_8.points} onChange={handleOnChangePoints('rider_8', 'away')}/>
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