import React, { useContext } from 'react';
import CommonHeaderChat from './CommonHeaderChat';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import Navigation from '../../../layout/Navigation/Navigation';
//import { componentPagesMenu, dashboardPagesMenu } from '../../../menu';
import CommonHeaderRight from './CommonHeaderRight';
import useDeviceScreen from '../../../hooks/useDeviceScreen';
import ThemeContext from '../../../contexts/themeContext';
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import { componentPagesMenu } from '../../../menu';

const DashboardHeader = () => {
	const { width } = useDeviceScreen();
	const { tabs } = useContext(ThemeContext);
	return (
		<Header>
					<HeaderLeft>
						{/* <Search /> */}
						<Navigation
							//menu={{ ...tabs }}
							menu={{ ...tabs }}
							id='docMenu-top-menu'
							horizontal={
								!!width && width >= Number(import.meta.env.VITE_MOBILE_BREAKPOINT_SIZE)
							}
						/>

					</HeaderLeft>
					<CommonHeaderRight afterChildren={<CommonHeaderChat />} />

		</Header>
	);
};

export default DashboardHeader;
