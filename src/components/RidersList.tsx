import React, { Component, useEffect, FunctionComponent, useState } from 'react';
import {FiX, FiXCircle, FiPlus} from 'react-icons/fi';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { IconButton } from '@material-ui/core';
import addNotification from '../utils/addNotification';

class RidersList extends Component<{}, {riders}> {
    constructor(props){
    super(props)
        this.state={
            riders: []
        }
    }

    refreshPage(){
        window.location.reload(false);
      }

    async deleteRiders(id) {
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
                `https://fantasy-league-eti.herokuapp.com/riders/${id.id}`,
                options
            );
            ////Sukces
            addNotification("Sukces!", "Udało się usunąć zawodnika!", "success", 1000);
            setTimeout(() => {
                //setAddRiderSuccess(false);
                this.refreshPage();
            }, 1000);
        } catch (e) {
            addNotification("Błąd!", "Nie udało się usunąć zawodnika!", "danger", 1000);
            console.log(e.response);
            throw new Error('Error in deleting riders!');
        }
    };


    async getRiders() {
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
            this.setState(() => ({
                riders: []
            }));
            data.map((rider) => {
                this.setState({
                    riders: this.state.riders.concat({
                        id: rider._id, 
                        imię: rider.first_name,
                        nazwisko: rider.last_name,
                        przydomek: rider.nickname,
                        data_urodzenia: rider.date_of_birth,
                        zagraniczny: rider.isForeigner,
                        ksm: rider.ksm
                    })
                });
            });
        } catch (e) {
            console.log(e.response);
            throw new Error('Error in getting riders!');
        }
    };

    componentDidMount(){
        this.getRiders()
    }

    ifForeigner(foreigner)
    {
        if(foreigner.zagraniczny == true)
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

    ifJunior(date)
    {
        if(((new Date().getFullYear())-(new Date(date.data_urodzenia).getFullYear()))<22)
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

    renderTableData() {
        return this.state.riders.map((rider, index) => {
            const {id, imię, nazwisko, przydomek, data_urodzenia, zagraniczny, ksm} = rider
            return (
                <tr key={id}>
                    <td className="first-column">{imię}</td>
                    <td>{nazwisko}</td>
                    <td>{przydomek}</td>
                    <td>{new Intl.DateTimeFormat("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit"
                        }).format(new Date(data_urodzenia))}</td>
                    <td>{this.ifForeigner({zagraniczny})}</td>
                    <td>{this.ifJunior({data_urodzenia})}</td>
                    <td></td>
                    <td className="table-X">
                        <IconButton  onClick={(event: React.MouseEvent<HTMLElement>) => {this.deleteRiders({id})}} className="delete-button">
                            <FiXCircle />
                        </IconButton>
                    </td>
                </tr>
            )
        })
    }

    renderTableHeader(){
        let header = ["Imię", "Nazwisko", "Przydomek", "Data urodzenia", "Polak", "Junior", "Klub"];
        return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    render() {
        return (
            <div>
                <table id="riders-list">
                    <tbody>
                        <tr>{this.renderTableHeader()}<th className="table-X__header">USUŃ</th></tr>
                        {this.renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default RidersList;