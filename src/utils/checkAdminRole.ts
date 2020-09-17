const checkAdminRole = (role: string): boolean => {
	return role === 'ADMIN' ? true : false;
};

export default checkAdminRole;
