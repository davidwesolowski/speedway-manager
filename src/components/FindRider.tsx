import React, { FunctionComponent, useState, useEffect } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';

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
            throw new Error('Error in getting riders');
        }
    };

    const renderTableData = () => {
        return riders.map((rider, index) => {
            const {id, first_name, last_name, nickname, date_of_birth} = rider
            return (
                <tr key = {id}>
                    <td>{first_name}</td>
                    <td>{last_name}</td>
                    <td>{nickname}</td>
                    <td>{date_of_birth}</td>
                </tr>
            )
        })
    }

    const renderTableHeader = () => {
        let header = ["Imię", "Nazwisko", "Przydomek", "Data urodzenia"];
        return header.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    useEffect(() => {
        getRiders()
    }, []);

    return(
        <>
        <div>
            <table id="riders-list">
                <tbody>
                    <tr>
                        {renderTableHeader()}
                    </tr>
                    {renderTableData()}
                </tbody>
            </table>
        </div>
        </>
    );
};

export default FindRider;