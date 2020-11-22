import React, { FunctionComponent } from 'react';
import {
	Dialog,
	DialogContent,
	DialogTitle,
	IconButton,
	Typography
} from '@material-ui/core';
import { FiX } from 'react-icons/fi';

interface IPopup {
	open: boolean;
	handleClose: () => void;
	title: string;
	component: any;
}

const Popup: FunctionComponent<IPopup> = props => {
	const { open, handleClose, title, component } = props;

	return (
		<Dialog open={open} onClose={handleClose}>
			<DialogTitle>
				<div className="dialog__header">
					<Typography variant="h4" className="dialog__title">
						{title}
					</Typography>
					<IconButton onClick={handleClose}>
						<FiX className="users__xIcon" />
					</IconButton>
				</div>
			</DialogTitle>
			<DialogContent dividers>{component}</DialogContent>
		</Dialog>
	);
};

export default Popup;
