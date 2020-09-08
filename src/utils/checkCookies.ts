/* eslint-disable @typescript-eslint/ban-types */
import Cookies from 'universal-cookie';
import addNotification from './addNotification';
import { Dispatch, SetStateAction } from 'react';
import getToken from './getToken';

export const checkCookies = (): boolean => {
	const accessToken = getToken();
	if (!accessToken) return false;
	return true;
};

export const checkBadAuthorization = (
	setLoggedIn: Dispatch<SetStateAction<boolean>>,
	push: (path: string, state?: {}) => void
): void => {
	const title = 'Błąd!';
	const type = 'danger';
	const message = 'Sesja wygasła!';
	const duration = 1000;
	const cookies = new Cookies();
	cookies.remove('accessToken');
	addNotification(title, message, type, duration);
	setTimeout(() => {
		setLoggedIn(false);
		push('/login');
	}, duration);
};
