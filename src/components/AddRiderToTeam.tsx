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
    const [teamId, setTeamId] = useState<string>("");
    const [teamRiders, setTeamRiders] = useState([]);

    const getRiders = async () => {
        try {
            //console.log("Wchodzi get");
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
            //console.log("Get1 poszedl");
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
            /*const {
                data_
            } = await axios.get(
                'https://fantasy-league-eti.herokuapp.com/teams',
                options
            );
            console.log("Get2 poszedl");
            console.log(data_);*/
            //setTeamId(data3[0]._id);
            /*const {
                data2
            } = await axios.get(
                `https://fantasy-league-eti.herokuapp.com/teams/${data3[0]._id}/riders`,
                options
            );
            console.log("Get3 poszedl");
            setTeamRiders(
                []
            );
            data2.map((rider) => {
                setTeamRiders(teamRiders => 
                    teamRiders.concat({
                        id: rider._id,
                        first_name: rider.first_name,
                        last_name: rider.last_name,
                        nickname: rider.nickname,
                        date_of_birth: rider.date_of_birth,
                        isForeigner: rider.isForeigner
                    })
                );
            });*/
            console.log("DATA");
            //console.log(data);
            getTeams(data);
            //console.log("DATA2");
            /*console.log(data2);
            setLists(data, data2);*/
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

    const getTeams = async (riders) => {
        try {
            console.log("Get Teams");
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
                'https://fantasy-league-eti.herokuapp.com/teams',
                options
            );
            console.log(data[0]);
            setTeamId(data[0]._id);
            /*const {
                data2
            } = await axios.get(
                `https://fantasy-league-eti.herokuapp.com/teams/${data[0]._id}/riders`,
                options
            );*/
            /*console.log("Team riders");
            console.log(data2);
            setTeamRiders(
                []
            );
            if(data2 !== undefined)
            {
                data2.map((rider) => {
                    setTeamRiders(teamRiders => 
                        teamRiders.concat({
                            id: rider._id,
                            first_name: rider.first_name,
                            last_name: rider.last_name,
                            nickname: rider.nickname,
                            date_of_birth: rider.date_of_birth,
                            isForeigner: rider.isForeigner
                        })
                    );
                });
                setLists(riders, data2);
            }
            else{
                setLists(riders, []);
            }*/
            getTeamRiders(riders, data);
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

    const getTeamRiders = async (riders, team) => {
        try {
            console.log("Get Teams");
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
                `https://fantasy-league-eti.herokuapp.com/teams/${team[0]._id}/riders`,
                options
            );
            console.log("Team riders");
            console.log(data);
            setTeamRiders(
                []
            );
            if(data !== undefined)
            {
                data.map((tuple) => {
                    setTeamRiders(teamRiders => 
                        teamRiders.concat({
                            id: tuple.rider._id,
                            first_name: tuple.rider.first_name,
                            last_name: tuple.rider.last_name,
                            nickname: tuple.rider.nickname,
                            date_of_birth: tuple.rider.date_of_birth,
                            isForeigner: tuple.rider.isForeigner
                        })
                    );
                });
                setLists(riders, data);
            }
            else{
                setLists(riders, []);
            }
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

    const [leftPolish, setLeftPolish] = React.useState([]);
    const [leftForeign, setLeftForeign] = React.useState([]);
    const [leftU21, setLeftU21] = React.useState([]);

    const [rightPolish, setRightPolish] = React.useState([]);
    const [rightForeign, setRightForeign] = React.useState([]);
    const [rightU21, setRightU21] = React.useState([]);

    const isJunior = (date) =>
    {
        if(((new Date().getFullYear())-(new Date(date).getFullYear()))<22)
        {
            return(
                true
            )
        }
        else{
            return(
                false
           ) 
        }
    }

    const setLists = (riders, teamRiders) => {
        console.log("Riders");
        console.log(riders);
        console.log('Team riders:');
        console.log(teamRiders);
        const teamRiderIDs = teamRiders.map(val => {return val.riderId});
        console.log("Team IDs");
        console.log(teamRiderIDs);
        setLeftPolish(
            riders.filter(rider => !teamRiderIDs.includes(rider._id) && !rider.isForeigner && !isJunior(rider.date_of_birth))
        )
        setRightPolish(
            riders.filter(rider => teamRiderIDs.includes(rider._id) && !rider.isForeigner && !isJunior(rider.date_of_birth))
        )
        setLeftForeign(
            riders.filter(rider => !teamRiderIDs.includes(rider._id) && rider.isForeigner)
        )
        setRightForeign(
            riders.filter(rider => teamRiderIDs.includes(rider._id) && rider.isForeigner)
        )
        setLeftU21(
            riders.filter(rider => !teamRiderIDs.includes(rider._id) && !rider.isForeigner && isJunior(rider.date_of_birth))
        )
        setRightU21(
            riders.filter(rider => teamRiderIDs.includes(rider._id) && !rider.isForeigner && isJunior(rider.date_of_birth))
        )
    }

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
        //console.log(leftPolishChecked);
        //console.log(rightPolishChecked);
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

    const customList = (items, type, side) =>{
        return(
        <Paper className={classes.paper}>
            <List dense component="div" role="list">
                {items.map((rider) => {
                    const labelId = `transfer-list-item-${rider.id}-label`;
                    if(type === "Polish"){
                        return(
                            <ListItem key={rider._id} role="listitem" button onClick={handleToggle(rider, type)}>
                                <ListItemIcon>
                                    <Checkbox
                                        checked={checkedPolish.indexOf(rider) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                        inputProps={{ 'aria-labelledby': labelId }}
                                    />
                                </ListItemIcon>
                                <ListItemText id={labelId} primary={`${rider.first_name} ${rider.last_name}`} />
                            </ListItem>
                        )
                    }else if(type === "Foreign"){
                        return(<ListItem key={rider._id} role="listitem" button onClick={handleToggle(rider, type)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checkedForeign.indexOf(rider) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${rider.first_name} ${rider.last_name}`} />
                        </ListItem>)
                    }else{
                        return(<ListItem key={rider._id} role="listitem" button onClick={handleToggle(rider, type)}>
                            <ListItemIcon>
                                <Checkbox
                                    checked={checkedU21.indexOf(rider) !== -1}
                                    tabIndex={-1}
                                    disableRipple
                                    inputProps={{ 'aria-labelledby': labelId }}
                                />
                            </ListItemIcon>
                            <ListItemText id={labelId} primary={`${rider.first_name} ${rider.last_name}`} />
                        </ListItem>)
                    }
                })}
                <ListItem />
            </List>
        </Paper>
    );
    }

    const addNewRider = async (rider) => {
        try {
            console.log(rider);
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
                `https://fantasy-league-eti.herokuapp.com/teams/${teamId}/riders`,
                {riderId: rider._id},
                options
            );
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
    }

    const deleteRiderFromTeam = async (rider) => {
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
            } = await axios.delete(
                `https://fantasy-league-eti.herokuapp.com/teams/${teamId}/riders/${rider.id}`,
                options
            );
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
    }

    const submitRiders = async () => {
        try{
            const chosenRiders = rightU21.concat(rightForeign.concat(rightPolish));
            const chosenRidersIDs = chosenRiders.map(val => {return val._id});
            const teamRidersIDs = teamRiders.map(val => {return val.id});
            console.log("Chosen riders");
            console.log(chosenRiders);
            const deleteRiders = teamRiders.filter(rider => !chosenRidersIDs.includes(rider.id));
            console.log("Team riders");
            console.log(teamRiders);
            console.log("Delete riders");
            console.log(deleteRiders);
            const newRiders = chosenRiders.filter(rider => !teamRidersIDs.includes(rider._id));
            console.log("New riders");
            console.log(newRiders);

            deleteRiders.map(rider =>
                deleteRiderFromTeam(rider)    
            )
            newRiders.map(rider =>
                addNewRider(rider)
            )
            
            //addNewRider(newRiders[0]);
            addNotification("Sukces", "Udalo sie", "success", 5000);
        }
        catch(e) {
            addNotification("Błąd", "Nie udało się", "danger", 5000);
        }
    }

    useEffect(() => {
        getRiders();
    }, [])

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
                    Polacy
                </Typography>
                <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid item>{customList(leftPolish, "Polish", "Left")}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedRight("Polish")}
                                disabled={leftPolishChecked.length === 0 || leftPolishChecked.length > (10 - rightForeign.length - rightPolish.length - rightU21.length)}
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
                    <Grid item>{customList(rightPolish,"Polish", "Right")}</Grid>
                </Grid>

                <Typography variant="h3" className="add-rider-to-team__type-header">
                    U21 (minimum 3 w kadrze)
                </Typography>
                <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid item>{customList(leftU21, "U21", "Left")}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedRight("U21")}
                                disabled={leftU21Checked.length === 0 || leftU21Checked.length > (10 - rightForeign.length - rightPolish.length - rightU21.length)}
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
                    <Grid item>{customList(rightU21,"U21", "Right")}</Grid>
                </Grid>

                <Typography variant="h3" className="add-rider-to-team__type-header">
                    Obcokrajowcy (maksymalnie 3 w kadrze)
                </Typography>
                <Grid container spacing={2} justify="center" alignItems="center" className={classes.root}>
                    <Grid item>{customList(leftForeign, "Foreign", "Left")}</Grid>
                    <Grid item>
                        <Grid container direction="column" alignItems="center">
                            <Button
                                variant="outlined"
                                size="small"
                                className={classes.button}
                                onClick={handleCheckedRight("Foreign")}
                                disabled={leftForeignChecked.length === 0 ||  leftForeignChecked.length > (3-rightForeign.length) || leftForeignChecked.length > (10 - rightForeign.length - rightPolish.length - rightU21.length)}
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
                    <Grid item>{customList(rightForeign,"Foreign", "Right")}</Grid>
                </Grid>
                <Button
                    size="large"
                    disabled={(rightForeign.length + rightPolish.length + rightU21.length) !== 10}
                    onClick={submitRiders}
                >
                    Zapisz zmiany
                </Button>

            </Paper>
        </div>
        </>
    )
}

export default AddRiderToTeam;