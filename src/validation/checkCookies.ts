/* eslint-disable @typescript-eslint/ban-types */
import Cookies from 'universal-cookie';
import addNotification from '../utils/addNotification';
import { Dispatch, SetStateAction } from 'react';

export const checkCookies = (): boolean => {
	const cookies = new Cookies();
	const access_token = cookies.get('access_token');
	if (!access_token) return false;
	return true;
};

export const checkBadAuthorization = (
	setLoggedIn: Dispatch<SetStateAction<boolean>>,
	push: (path: string, state?: {}) => void
): void => {
	const title = 'Błąd!';
	const type = 'danger';
	const message = 'Sesja wygasła!';
	const duration = 3000;
	const cookies = new Cookies();
	cookies.remove('access_token');
	addNotification(title, message, type, duration);
	setTimeout(() => {
		setLoggedIn(false);
		push('/login');
	}, duration);
};
