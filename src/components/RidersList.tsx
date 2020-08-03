import React, { Component, useEffect, FunctionComponent, useState } from 'react';
import FiX from 'react-icons/fi';
import Cookies from 'universal-cookie';
import axios from 'axios';

/*const RidersList: FunctionComponent = () => {
    
    interface IRider{
        imię: string,
        nazwisko: string,
        przydomek: string,
        data_urodzenia: string
    }

    const [riders, setRiders] = useState<Array<IRider>>();

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
            setRiders([]);
            data.map((rider) => {
                setRiders(
                        riders.concat({
                        imię: rider.first_name,
                        nazwisko: rider.last_name,
                        przydomek: rider.nickname,
                        data_urodzenia: rider.date_of_birth
                    })
                );
            });

            //setAddRiderError(false);
            //setAddRiderSuccess(true);
        } catch (e) {
            //setAddRiderSuccess(false);
            //setAddRiderError(true);
            console.log(e.response);
            throw new Error('Error in adding new rider!');
        }
    };


    const renderTableData = () => {
        getRiders();
        return riders.map((rider, index) => {
            const {imię, nazwisko, przydomek, data_urodzenia} = rider
            return (
                <tr>
                    <td className="first-column">{imię}</td>
                    <td>{nazwisko}</td>
                    <td>{przydomek}</td>
                    <td>{data_urodzenia}</td>
                    <td></td>
                    <td className="table-X">
                        <a href="/usun">
                            X
                        </a>
                    </td>
                </tr>
            )
        })
    }

    const renderTableHeader = () =>{
        let header = ["Imię", "Nazwisko", "Przydomek", "Data urodzenia", "Klub"];
        return header.map((key, index) => {
        return <th key={index}>{key.toUpperCase()}</th>
        })
    }

        return (
            <div>
                <table id="riders-list">
                    <tbody>
                        <tr>{renderTableHeader()}<th className="table-X__header">USUŃ</th></tr>
                        {renderTableData()}
                    </tbody>
                </table>
            </div>
        )
    
}
*/
class RidersList extends Component<{}, {riders}> {
    constructor(props){
    super(props)
        this.state={
            //Domyślnie tutaj zaciąganie zawodników z bazy
            riders: [
                /*{imię: "Tobiasz", nazwisko: "Musielak", przydomek: "Tofik", data_urodzenia: "1-1-1990", klub: "Apator Toruń"},
                {imię: "Tobiasz", nazwisko: "Musielak", przydomek: "Tofik", data_urodzenia: "1-1-1990", klub: "Apator Toruń"},
                {imię: "Tobiasz", nazwisko: "Musielak", przydomek: "Tofik", data_urodzenia: "1-1-1990", klub: "Apator Toruń"}
            */ ]
        }
    }

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
                       // id: 
                        imię: rider.first_name,
                        nazwisko: rider.last_name,
                        przydomek: rider.nickname,
                        data_urodzenia: rider.date_of_birth
                    })
                });
            });

            //setAddRiderError(false);
            //setAddRiderSuccess(true);
        } catch (e) {
            //setAddRiderSuccess(false);
            //setAddRiderError(true);
            console.log(e.response);
            throw new Error('Error in adding new rider!');
        }
    };


    renderTableData() {
        this.getRiders();
        return this.state.riders.map((rider, index) => {
            const {imię, nazwisko, przydomek, data_urodzenia} = rider
            return (
                <tr>
                    <td className="first-column">{imię}</td>
                    <td>{nazwisko}</td>
                    <td>{przydomek}</td>
                    <td>{data_urodzenia}</td>
                    <td></td>
                    <td className="table-X">
                        <a href="/usun">
                            X
                        </a>
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