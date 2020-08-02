import React, { Component } from 'react';
import FiX from 'react-icons/fi';

class RidersList extends Component<{}, {riders}> {
    constructor(props){
    super(props)
        this.state={
            //Domyślnie tutaj zaciąganie zawodników z bazy
            riders: [
                {imię: "Tobiasz", nazwisko: "Musielak", przydomek: "Tofik", data_urodzenia: "1-1-1990", klub: "Apator Toruń"},
                {imię: "Tobiasz", nazwisko: "Musielak", przydomek: "Tofik", data_urodzenia: "1-1-1990", klub: "Apator Toruń"},
                {imię: "Tobiasz", nazwisko: "Musielak", przydomek: "Tofik", data_urodzenia: "1-1-1990", klub: "Apator Toruń"}
            ]
        }
    }

    renderTableData() {
        return this.state.riders.map((rider, index) => {
            const {imię, nazwisko, przydomek, data_urodzenia, klub} = rider
            return (
                <tr>
                    <td className="first-column">{imię}</td>
                    <td>{nazwisko}</td>
                    <td>{przydomek}</td>
                    <td>{data_urodzenia}</td>
                    <td>{klub}</td>
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
        let header = Object.keys(this.state.riders[0])
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