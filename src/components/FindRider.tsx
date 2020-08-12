import React, { FunctionComponent, useState, useEffect } from 'react';
import {RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Paper, Typography, Divider, TextField, InputLabel, Select, MenuItem } from '@material-ui/core';
import addNotification from '../utils/addNotification';
import { FiX, FiPlus } from 'react-icons/fi';

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

interface ISelect{
    nationality: string;
    age: string;
}

const FindRider: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {

    const [riders, setRiders] = useState([]);
    const [phrase, setPhrase] = useState<string>("");
    const [selects, setSelects] = useState<ISelect>({
        nationality: "All",
        age: "All"
    });
    const [filteredRiders, setFilteredRiders] = useState([]);
    const [filteredNationality, setFilteredNationality] = useState([]);
    const [filteredAge, setFilteredAge] = useState([]);
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

    const ifForeigner = (foreigner) =>
    {
        if(foreigner.isForeigner == true)
        {
           return(
                <FiX className="NoX"></FiX>
           ) 
        }
        else{
            return(
                <FiPlus className="YesPlus"></FiPlus>
            )
        }
    }

    const ifJunior = (date) =>
    {
        if(((new Date().getFullYear())-(new Date(date.date_of_birth).getFullYear()))<22)
        {
            return(
                <FiPlus className="YesPlus"></FiPlus>
            )
        }
        else{
            return(
                <FiX className="NoX"></FiX>
           ) 
        }
    }

    const filtr = () => {
        if(selects.age == "U23")
        {
            if(selects.nationality == "All")
            {
                setFilteredRiders(
                    riders.filter(rider => ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())<24))
                )
            }
            else if(selects.nationality == "Polish")
            {
                setFilteredRiders(
                    riders.filter(rider => (rider.isForeigner == false) && ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())<24))
                );
            }
            else
            {
                setFilteredRiders(
                    riders.filter(rider => (rider.isForeigner == true) && ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())<24))
                );
            }
        }
        else if(selects.age == "U21")
        {
            if(selects.nationality == "All")
            {
                setFilteredRiders(
                    riders.filter(rider => ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())<22))
                )
            }
            else if(selects.nationality == "Polish")
            {
                setFilteredRiders(
                    riders.filter(rider => (rider.isForeigner == false) && ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())<22))
                );
            }
            else
            {
                setFilteredRiders(
                    riders.filter(rider => (rider.isForeigner == true) && ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())<22))
                );
            }
        }
        else if(selects.age == "22+")
        {
            if(selects.nationality == "All")
            {
                setFilteredRiders(
                    riders.filter(rider => ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())>21))
                )
            }
            else if(selects.nationality == "Polish")
            {
                setFilteredRiders(
                    riders.filter(rider => (rider.isForeigner == false) && ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())>21))
                );
            }
            else
            {
                setFilteredRiders(
                    riders.filter(rider => (rider.isForeigner == true) && ((new Date().getFullYear() - new Date(rider.date_of_birth).getFullYear())>21))
                );
            }
        }
        else
        {
            if(selects.nationality == "Polish")
            {
                setFilteredRiders(
                    riders.filter(rider => (rider.isForeigner == false))
                );
            }
            else
            {
                setFilteredRiders(
                    riders.filter(rider => (rider.isForeigner == true))
                );
            }
        }
    }

    const renderTableData = () => {
        useEffect(() => {
            filtr();
        }, [phrase, selects.age, selects.nationality])
        if(phrase.length == 0 && selects.age == "All" && selects.nationality == "All")
        {
            return riders.map((rider, index) => {
                const {id, first_name, last_name, nickname, date_of_birth, isForeigner, ksm} = rider
                return (
                    <tr key = {id} style={index % 2? { background: "white"} : {background: "#dddddd"}}>
                        <td>{first_name}</td>
                        <td>{last_name}</td>
                        <td>{nickname}</td>
                        <td>{new Intl.DateTimeFormat("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        }).format(new Date(date_of_birth))}</td>
                        <td>{ifForeigner({isForeigner})}</td>
                        <td>{ifJunior({date_of_birth})}</td>
                        <td></td>
                    </tr>
                )
            })
        }
        else if(phrase.length == 0)
        {
            return filteredRiders.map((rider, index) => {
                const {id, first_name, last_name, nickname, date_of_birth, isForeigner, ksm} = rider
                return (
                    <tr key = {id} style={index % 2? { background: "white"} : {background: "#dddddd"}}>
                        <td>{first_name}</td>
                        <td>{last_name}</td>
                        <td>{nickname}</td>
                        <td>{new Intl.DateTimeFormat("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        }).format(new Date(date_of_birth))}</td>
                        <td>{ifForeigner({isForeigner})}</td>
                        <td>{ifJunior({date_of_birth})}</td>
                        <td></td>
                    </tr>
                )
            })
        }
        else
        {
            return filteredRiders.filter(rider => ((rider.first_name.toUpperCase())+" "+(rider.last_name.toUpperCase())).includes(phrase.toUpperCase())).map((rider, index) => {
                const {id, first_name, last_name, nickname, date_of_birth, foreigner, ksm} = rider
                return (
                    <tr key = {id} style={index % 2? { background: "white"} : {background: "#dddddd"}}>
                        <td>{first_name}</td>
                        <td>{last_name}</td>
                        <td>{nickname}</td>
                        <td>{new Intl.DateTimeFormat("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        }).format(new Date(date_of_birth))}</td>
                        <td>{ifForeigner({foreigner})}</td>
                        <td>{ifJunior({date_of_birth})}</td>
                        <td></td>
                    </tr>
                )
            })
        }
    }

    const renderTableHeader = () => {
        let header = ["Imię", "Nazwisko", "Przydomek", "Data urodzenia", "Polak", "Junior", "Klub"];
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const handleOnChange = () => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        event.persist();
        if(event.target) {
            setPhrase(
                phrase => event.target.value
            );
        };
    }

    const handleOnChangeSelect = (name: string) => (
        event
    ) => {
        event.persist();
        if(event.target) {
            setSelects((prevState: ISelect) => ({
                ...prevState,
                [name]: event.target.value
            }));
        };
    }

    useEffect(() => {
        getRiders()
    }, []);

    return(
        <>
        <div className="find-rider">
            <div className="find-rider__background"/>
            <Paper className="find-rider__box">
                <Typography variant="h2" className="riders__header">
                    Szukaj zawodnika
                </Typography>
                <Divider/>
                <div className="find-rider__search">
                    <div className="find-rider__search-phrase">
                        <TextField
                            label="Szukaj"
                            value={phrase}
                            onChange={handleOnChange()}
                            className="find-rider__phrase"
                        />
                    </div>
                    <div className="find-rider__search-select1">
                        <InputLabel id="label1">Narodowość:</InputLabel>
                        <Select labelId="label1" className="find-rider__select1" value={selects.nationality} onChange={handleOnChangeSelect('nationality')}>
                            <MenuItem value="All">Wszyscy</MenuItem>
                            <MenuItem value="Polish">Polacy</MenuItem>
                            <MenuItem value="Foreigner">Obcokrajowcy</MenuItem>
                        </Select>
                    </div>
                    <div className="find-rider__search-select2">
                        <InputLabel id="label2">Wiek:</InputLabel>
                        <Select labelId="label2" className="find-rider__select2" value={selects.age} onChange={handleOnChangeSelect('age')}>
                            <MenuItem value="All">Wszyscy</MenuItem>
                            <MenuItem value="U23">U23</MenuItem>
                            <MenuItem value="U21">U21</MenuItem>
                            <MenuItem value="22+">Seniorzy</MenuItem>
                        </Select>
                    </div>
                </div>
                <table id="riders-list">
                    <tbody>
                        <tr>
                            {renderTableHeader()}
                        </tr>
                        {renderTableData()}
                    </tbody>
                </table>
            </Paper>
        </div>
        </>
    );
};

export default FindRider;