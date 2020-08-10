import React, { FunctionComponent, useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Paper, Typography, Divider, TextField } from '@material-ui/core';
import addNotification from '../utils/addNotification';

interface IRider{
    //id: string;
    first_name: string;
    last_name: string;
    nickname: string;
    date_of_birth: string;
    //club: string;
}

const FindRider: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {

    const [riders, setRiders] = useState([]);
    const [phrase, setPhrase] = useState<string>("");
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
            console.log(data);
            data.map((rider) => {
                setRiders(riders => 
                    riders.concat({
                        id: rider._id,
                        first_name: rider.first_name,
                        last_name: rider.last_name,
                        nickname: rider.nickname,
                        date_of_birth: rider.date_of_birth
                    })
                );
            });
        } catch (e) {
            console.log(e.response);
            addNotification("Błąd", "Sesja wygasła", "danger", 3000);
            setTimeout(() => {
                push("/login")
            }, 3000);
            throw new Error('Error in getting riders');
        }
    };

    const renderTableData = () => {
        if(phrase.length == 0)
        {
            return riders.map((rider, index) => {
                const {id, first_name, last_name, nickname, date_of_birth} = rider
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
                    </tr>
                )
            })
        }
        else
        {
            return riders.filter(rider => ((rider.first_name.toUpperCase())+" "+(rider.last_name.toUpperCase())).includes(phrase.toUpperCase())).map((rider, index) => {
                const {id, first_name, last_name, nickname, date_of_birth} = rider
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
                    </tr>
                )
            })
        }
    }

    const renderTableHeader = () => {
        let header = ["Imię", "Nazwisko", "Przydomek", "Data urodzenia"];
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
                <TextField
                    label="Szukaj"
                    value={phrase}
                    onChange={handleOnChange()}
                    className="find-rider__phrase"
                />
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