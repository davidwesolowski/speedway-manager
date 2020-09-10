import { UPDATE_USER, SET_USER } from './actionDefinitions';

export interface IUser {
	_id?: string;
	email?: string;
	username?: string;
	avatarUrl?: string | undefined;
}

export interface UserAction {
	type: string;
	payload: IUser;
}

export const setUser = (user: IUser): UserAction => ({
	type: SET_USER,
	payload: user
});

export const updateUser = (user: IUser): UserAction => ({
	type: UPDATE_USER,
	payload: user
});
