import React, { Component, useEffect, FunctionComponent, useState } from 'react';
import FiX, { FiXCircle } from 'react-icons/fi';
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
                        data_urodzenia: rider.date_of_birth
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

    renderTableData() {
        return this.state.riders.map((rider, index) => {
            const {id, imię, nazwisko, przydomek, data_urodzenia} = rider
            return (
                <tr key={id}>
                    <td className="first-column">{imię}</td>
                    <td>{nazwisko}</td>
                    <td>{przydomek}</td>
                    <td>{data_urodzenia}</td>
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
        let header = ["Imię", "Nazwisko", "Przydomek", "Data urodzenia", "Klub"];
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