import React, { FunctionComponent, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Paper, Typography, Divider, Button, InputLabel, MenuItem, Select } from "@material-ui/core";

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

const AddMatch: FunctionComponent<RouteComponentProps> = ({
    history: { push }
}) => {

    const defaultRiderPoints = {
        id: "",
        points: 0
    }

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
                        <Select labelId="roundLabel" className="add-match__round-select" value={round}>
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
                    </div>
                    <div className="add-match__home-div">
                        HOME
                        <br/>
                        <Select className="add-match__team-select" value={home.team_id}>
                            <MenuItem value="Home">Gospodarze</MenuItem>
                        </Select>
                    </div>
                    <br/>
                    <Button>
                        Dodaj
                    </Button>
                </Paper>
            </div>
        </>
    )
}

export default AddMatch;