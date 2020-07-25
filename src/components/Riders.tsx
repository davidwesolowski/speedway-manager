import React, {FunctionComponent} from 'react';
import {
	Paper,
	Typography,
	Divider,
	TextField,
	IconButton,
	Button
} from '@material-ui/core';

const Riders: FunctionComponent = () => {
    
    return(
        <div className="riders">
            <div className="riders__background"></div>
            <Paper className="riders__box">
                <Typography variant="h2" className="riders__header">
                    Dodawanie zawodnika
                </Typography>
                <Divider />
            </Paper>
        </div>
    );

};

export default Riders;