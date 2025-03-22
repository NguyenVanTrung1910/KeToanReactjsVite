import React, { createContext, useLayoutEffect, useState, useMemo, FC, ReactNode } from 'react';
import useDeviceScreen from '../hooks/useDeviceScreen';
//import { TIcons } from '../type/icons-type';
import { dashboardPagesMenu } from '../menu';

interface TapItem {
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
export interface IThemeContextProps {
	asideStatus: boolean;
	darkModeStatus: boolean;
	fullScreenStatus: boolean;
	leftMenuStatus: boolean;
	mobileDesign: boolean;
	rightMenuStatus: boolean;
	rightPanel: boolean;
	tabs: TapItem;
	setTabs: (value: ((prevState: TapItem) => TapItem) | TapItem) => void;
	setAsideStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setDarkModeStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setFullScreenStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setLeftMenuStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setRightMenuStatus: (value: ((prevState: boolean) => boolean) | boolean) => void;
	setRightPanel: (value: ((prevState: boolean) => boolean) | boolean) => void;
}
const ThemeContext = createContext<IThemeContextProps>({} as IThemeContextProps);

interface IThemeContextProviderProps {
	children: ReactNode;
}
const akm = dashboardPagesMenu;
export { akm };
export const ThemeContextProvider: FC<IThemeContextProviderProps> = ({ children }) => {
	const deviceScreen = useDeviceScreen();
	const [tabs, setTabs] = useState<TapItem>(	{
		dashboard: {
		id: 'dashboard',
		text: 'Dashboard',
		path: '/',
		icon: 'Dashboard',
		subMenu: null,
		}
	},);

	// @ts-ignore
	const mobileDesign = deviceScreen?.width <= import.meta.env.VITE_MOBILE_BREAKPOINT_SIZE;

	const [darkModeStatus, setDarkModeStatus] = useState(
		localStorage.getItem('facit_darkModeStatus')
			? localStorage.getItem('facit_darkModeStatus') === 'true'
			: import.meta.env.VITE_DARK_MODE === 'true',
	);

	useLayoutEffect(() => {
		localStorage.setItem('facit_darkModeStatus', darkModeStatus.toString());
	}, [darkModeStatus]);

	const [fullScreenStatus, setFullScreenStatus] = useState(false);

	const [leftMenuStatus, setLeftMenuStatus] = useState(false);
	const [rightMenuStatus, setRightMenuStatus] = useState(false);
	const [asideStatus, setAsideStatus] = useState(
		localStorage.getItem('facit_asideStatus')
			? localStorage.getItem('facit_asideStatus') === 'true'
			: // @ts-ignore
				deviceScreen?.width >= import.meta.env.VITE_ASIDE_MINIMIZE_BREAKPOINT_SIZE,
	);

	useLayoutEffect(() => {
		localStorage.setItem('facit_asideStatus', asideStatus?.toString());
	}, [asideStatus]);

	const [rightPanel, setRightPanel] = useState(false);

	useLayoutEffect(() => {
		// @ts-ignore
		if (deviceScreen?.width >= import.meta.env.VITE_ASIDE_MINIMIZE_BREAKPOINT_SIZE) {
			if (localStorage.getItem('facit_asideStatus') === 'true') setAsideStatus(true);
			setLeftMenuStatus(false);
			setRightMenuStatus(false);
		}
		return () => {
			setAsideStatus(false);
		};
	}, [deviceScreen.width]);

	const values: IThemeContextProps = useMemo(
		() => ({
			mobileDesign,
			darkModeStatus,
			setDarkModeStatus,
			fullScreenStatus,
			setFullScreenStatus,
			asideStatus,
			setAsideStatus,
			leftMenuStatus,
			setLeftMenuStatus,
			rightMenuStatus,
			setRightMenuStatus,
			rightPanel,
			setRightPanel,
			tabs,
			setTabs,
		}),
		[
			asideStatus,
			darkModeStatus,
			fullScreenStatus,
			leftMenuStatus,
			mobileDesign,
			rightMenuStatus,
			rightPanel,
			tabs,
		],
	);

	return <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>;
};

export default ThemeContext;
