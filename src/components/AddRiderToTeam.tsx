import React, { FunctionComponent, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { Paper, Typography, Divider, TextField, InputLabel, Select, MenuItem } from '@material-ui/core';
import addNotification from '../utils/addNotification';
import { FiX, FiPlus } from 'react-icons/fi';

const AddRiderToTeam: FunctionComponent<RouteComponentProps> = ({
	history: { push }
}) => {

    return(
        <>
            <div>Hello</div>
        </>
    )

}

export default AddRiderToTeam;