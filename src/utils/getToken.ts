import Cookies from 'universal-cookie';

const getToken = (): string => {
	const cookies = new Cookies();
	const accessToken = cookies.get('accessToken');
	return accessToken;
};

export default getToken;
