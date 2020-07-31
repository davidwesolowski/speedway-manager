import { store } from 'react-notifications-component';

type NotificationType =
	| 'success'
	| 'danger'
	| 'info'
	| 'default'
	| 'warning'
	| undefined;

const addNotification = (
	title: string,
	message: string,
	type: NotificationType,
	duration: number
): void => {
	store.addNotification({
		title,
		message,
		type,
		insert: 'top',
		container: 'center',
		animationIn: ['animated', 'jackInTheBox'],
		animationOut: ['animated', 'fadeOut'],
		dismiss: {
			duration,
			showIcon: true
		}
	});
};

export default addNotification;
