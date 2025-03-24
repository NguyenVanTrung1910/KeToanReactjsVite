import React, { createContext, FC, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { getUserDataWithUsername, IUserProps } from '../common/data/userDummyData';
import api from "../Api/api";
import { MenuItem } from '@mui/material';
export interface IAuthContextProps {
	user: string;
	setUser?(...args: unknown[]): unknown;
	userData: Partial<IUserProps>;
	menus: React.MutableRefObject<MenuItem>;
}
const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
	children: ReactNode;
}
interface MenuItem {
	[key: string]: {
		id?: string;
		text?: string;
		path?: string;
		icon?: string;
		isDisable?: boolean;
		subMenu?: {
			[key: string]: {
				id?: string;
				text?: string;
				path?: string;
				icon?: string;
				isDisable?: boolean;
			};
		} | null;
	};
}
export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	const [user, setUser] = useState<string>(localStorage.getItem('facit_authUsername') || '');
	const [userData, setUserData] = useState<Partial<IUserProps>>({});
	const menus = useRef<MenuItem>(JSON.parse(localStorage.getItem("menus") || '{}'));
	async function GetMenu(): Promise<MenuItem | null> {
		try {
			const response = await api.get<MenuItem>("/menu/GetMenu");
			return response.data;
		} catch (error) {
			return null;
		}
	}
	useEffect(() => {
		localStorage.setItem('facit_authUsername', user);
		console.log(1);
		if (localStorage.getItem("menus") === null) {
			GetMenu().then((data) => {
				if (data) {
					menus.current = data;
					localStorage.setItem("menus", JSON.stringify(menus.current));
				}
			});
		}

	}, [user]);

	useEffect(() => {
		if (user !== '') {
			setUserData(getUserDataWithUsername(user));
		} else {
			setUserData({});
		}
	}, [user]);
	const value = useMemo(
		() => ({
			user,
			setUser,
			userData,
			menus,
		}),
		[user, userData],
	);
	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
