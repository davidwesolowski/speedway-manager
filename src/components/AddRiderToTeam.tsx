import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Paper, Typography, Divider, TextField, InputLabel, Select, MenuItem, List, ListItem, ListItemIcon, Checkbox, ListItemText, Grid, Button } from '@material-ui/core';
import addNotification from '../utils/addNotification';
import { makeStyles } from '@material-ui/core/styles';

interface IRider{
    //id: string;
    first_name: string;
    last_name: string;
    nickname: string;
    date_of_birth: string;
    isForeigner: boolean;
    ksm: number;
    //club: string;
}

const AddRiderToTeam: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {

    const useStyles = makeStyles((theme) => ({
       root: {
           margin: 'auto',
       },
       paper: {
           width: 200,
           height: 230,
           overflow: 'auto',
       },
       button: {
           margin: theme.spacing(0.5, 0),
       }
    }));

    const [riders, setRiders] = useState([]);

    const getRiders = async () => {
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
            } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/riders',
                options
            );
            setRiders(
                []
            );
            data.map((rider) => {
                setRiders(riders => 
                    riders.concat({
                        id: rider._id,
                        first_name: rider.first_name,
                        last_name: rider.last_name,
                        nickname: rider.nickname,
                        date_of_birth: rider.date_of_birth,
                        isForeigner: rider.isForeigner
                    })
                );
            });
        } catch (e) {
            console.log(e.response);
            if(e.response.statusText == "Unauthorized")
            {
                addNotification("Błąd", "Sesja wygasła", "danger", 3000);
                setTimeout(() => {
                    push("/login")
                }, 3000);
            }
            else {
                addNotification("Błąd", "Nie udało się pobrać zawodników z bazy", "danger", 3000);
            }
            throw new Error('Error in getting riders');
        }
    };

    const not = (a, b) => {
        return a.filter((value) => b.indexOf(value) === -1);
    }

    const intersection = (a, b) => {
        return a.filter((value) => b.indexOf(value) !== -1);
    }


    const classes = useStyles();

    const [checkedPolish, setCheckedPolish] = React.useState([]);
    const [checkedForeign, setCheckedForeign] = React.useState([]);
    const [checkedU21, setCheckedU21] = React.useState([]);

    const [leftPolish, setLeftPolish] = React.useState(["pol1","pol2","pol3","pol4","pol5"]);
    const [leftForeign, setLeftForeign] = React.useState(["int1", "int2"]);
    const [leftU21, setLeftU21] = React.useState(["u1", "u2"]);

    const [rightPolish, setRightPolish] = React.useState(["pol9","pol8","pol7","pol6"]);
    const [rightForeign, setRightForeign] = React.useState(["int3", "int4"]);
    const [rightU21, setRightU21] = React.useState(["u3", "u4"]);

    const leftPolishChecked = intersection(checkedPolish, leftPolish);
    const rightPolishChecked = intersection(checkedPolish, rightPolish);

    const leftForeignChecked = intersection(checkedForeign, leftForeign);
    const rightForeignChecked = intersection(checkedForeign, rightForeign);

    const leftU21Checked = intersection(checkedU21, leftU21);
    const rightU21Checked = intersection(checkedU21, rightU21);

    const handleToggle = (value, type) => () =>{
        if(type == "Polish"){
            const currentIndex = checkedPolish.indexOf(value);
            const newChecked = [...checkedPolish];
            if(currentIndex === -1){
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setCheckedPolish(newChecked);
        }
        else if(type == "Foreign"){
            const currentIndex = checkedForeign.indexOf(value);
            const newChecked = [...checkedForeign];
            if(currentIndex === -1){
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setCheckedForeign(newChecked);
        }
        else{
            const currentIndex = checkedU21.indexOf(value);
            const newChecked = [...checkedU21];
            if(currentIndex === -1){
                newChecked.push(value);
            } else {
                newChecked.splice(currentIndex, 1);
            }
            setCheckedU21(newChecked);
        }
        console.log(leftPolishChecked);
        console.log(rightPolishChecked);
    }

    const handleAllRight = (type) => () => {
        if(type == "Polish"){
            setRightPolish(rightPolish.concat(leftPolish));
            setLeftPolish([]);
        }
        else if(type == "Foreign"){
            setRightForeign(rightForeign.concat(leftForeign));
            setLeftForeign([]);
        }
        else{
            setRightU21(rightU21.concat(leftU21));
            setLeftU21([]);
        }
    }

    const handleCheckedRight = (type) => () => {
        if(type == "Polish"){
            setRightPolish(rightPolish.concat(leftPolishChecked));
            setLeftPolish(not(leftPolish, leftPolishChecked));
            setCheckedPolish(not(checkedPolish, leftPolishChecked));
        }
        else if(type == "Foreign"){
            setRightForeign(rightForeign.concat(leftForeignChecked));
            setLeftForeign(not(leftForeign, leftForeignChecked));
            setCheckedForeign(not(checkedForeign, leftForeignChecked));
        }
        else {
            setRightU21(rightU21.concat(leftU21Checked));
            setLeftU21(not(leftU21, leftU21Checked));
            setCheckedU21(not(checkedU21, leftU21Checked));
        }
    }

    const handleCheckedLeft = (type) => () => {
        if(type == "Polish"){
            setLeftPolish(leftPolish.concat(rightPolishChecked));
            setRightPolish(not(rightPolish, rightPolishChecked));
            setCheckedPolish(not(checkedPolish, rightPolishChecked));
        }
        else if(type == "Foreign"){
            setLeftForeign(leftForeign.concat(rightForeignChecked));
            setRightForeign(not(rightForeign, rightForeignChecked));
            setCheckedForeign(not(checkedForeign, rightForeignChecked));
        }
        else{
            setLeftU21(leftU21.concat(rightU21Checked));
            setRightU21(not(rightU21, rightU21Checked));
            setCheckedU21(not(checkedU21, rightU21Checked));
        }
    }

    const handleAllLeft = (type) => () => {
        if(type == "Polish"){
            setLeftPolish(leftPolish.concat(rightPolish));
            setRightPolish([]);
        }
        else if(type == "Foreign"){
            setLeftForeign(leftForeign.concat(rightForeign));
            setRightForeign([]);
        }
        else {
            setLeftU21(leftU21.concat(rightU21));
            setRightU21([]);
        }
    }

    const customList = (items, type) =>{
        return(
        <Paper className={classes.paper}>
            <List dense component="div" role="list">
                {items.map((value) => {
                    const labelId = `transfer-list-item-${value}-label`;
                    if(type === "Polish"){
                        return(
                            <ListItem key={value} role="listitem" button onClick={handleToggle(value, type)}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checkedPolish.indexOf(value) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${value}`} />
                            </ListItem>
                        )
                    }else if(type === "Foreign"){
                        return(<ListItem key={value} role="listitem" button onClick={handleToggle(value, type)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checkedForeign.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value}`} />
                        </ListItem>)
                    }else{
                        return(<ListItem key={value} role="listitem" button onClick={handleToggle(value, type)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checkedU21.indexOf(value) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${value}`} />
                        </ListItem>)
                    }
                })}
                <ListItem />
            </List>
        </Paper>
    );
    }

    return(
        <>
            <div className="add-rider-to-team">
            <div className="add-rider-to-team__background"/>
            <Paper className="add-rider-to-team__box">
                <Typography variant="h2" className="riders__header">
                    Wybierz zawodników do drużyny
                </Typography>
                <Divider/>

                <Typography variant="h3" className="add-rider-to-team__type-header">
                    Polacy (minimum 4 w kadrze)
                </Typography>
                <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid item>{customList(leftPolish, "Polish")}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleAllRight("Polish")}
                                disabled={leftPolish.length === 0}
                            >
                                ≫
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedRight("Polish")}
                                disabled={leftPolishChecked.length === 0}
                            >
                                &gt;
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedLeft("Polish")}
                                disabled={rightPolishChecked.length === 0}
                            >
                                &lt;
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleAllLeft("Polish")}
                                disabled={rightPolish.length === 0}
                            >
                                ≪
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customList(rightPolish,"Polish")}</Grid>
                </Grid>

                <Typography variant="h3" className="add-rider-to-team__type-header">
                    U21 (minimum 3 w kadrze)
                </Typography>
                <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid item>{customList(leftU21, "U21")}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleAllRight("U21")}
                                disabled={leftU21.length === 0}
                            >
                                ≫
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedRight("U21")}
                                disabled={leftU21Checked.length === 0}
                            >
                                &gt;
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedLeft("U21")}
                                disabled={rightU21Checked.length === 0}
                            >
                                &lt;
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleAllLeft("U21")}
                                disabled={rightU21.length === 0}
                            >
                                ≪
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customList(rightU21,"U21")}</Grid>
                </Grid>

                <Typography variant="h3" className="add-rider-to-team__type-header">
                    Obcokrajowcy
                </Typography>
                <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid item>{customList(leftForeign, "Foreign")}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleAllRight("Foreign")}
                                disabled={leftForeign.length === 0}
                            >
                                ≫
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedRight("Foreign")}
                                disabled={leftForeignChecked.length === 0}
                            >
                                &gt;
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedLeft("Foreign")}
                                disabled={rightForeignChecked.length === 0}
                            >
                                &lt;
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleAllLeft("Foreign")}
                                disabled={rightForeign.length === 0}
                            >
                                ≪
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item>{customList(rightForeign,"Foreign")}</Grid>
                </Grid>

            </Paper>
        </div>
        </>
    )
}

export default AddRiderToTeam;