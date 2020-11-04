import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	Typography
} from '@material-ui/core';
import React, { FunctionComponent } from 'react';

interface IRemoveDialog {
	removeDialog: boolean;
	title: string;
	handleRemoveClose: () => void;
	removeFunction: () => Promise<void>;
}

const RemoveDialog: FunctionComponent<IRemoveDialog> = props => {
	const { removeDialog, handleRemoveClose, title, removeFunction } = props;
	const remove = () => {
		removeFunction();
		handleRemoveClose();
	};
	return (
		<Dialog open={removeDialog} onClose={handleRemoveClose}>
			<DialogTitle>
				<div>
					<Typography variant="h4" className="dialog__title">
						{title}
					</Typography>
				</div>
			</DialogTitle>
			<DialogActions>
				<Button className="btn" onClick={handleRemoveClose}>
					Anuluj
				</Button>
				<Button className="btn dialog__button-approve" onClick={remove}>
					Usuń
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default RemoveDialog;
