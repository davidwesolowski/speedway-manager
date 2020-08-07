/* eslint-disable @typescript-eslint/ban-types */
import Cookies from 'universal-cookie';

export const checkCookies = (): boolean => {
	const cookies = new Cookies();
	const access_token = cookies.get('access_token');
	if (!access_token) return false;
	return true;
};

export default checkCookies;
