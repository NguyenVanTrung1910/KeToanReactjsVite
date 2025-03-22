import React from 'react';
import { RouteProps } from 'react-router-dom';
import {
	componentPagesMenu,
	dashboardPagesMenu,
	demoPagesMenu,
	gettingStartedPagesMenu,
	pageLayoutTypesPagesMenu,
} from '../menu';

import DashboardHeader from '../pages/_layout/_headers/DashboardHeader';

const headers: RouteProps[] = [
	{ path: pageLayoutTypesPagesMenu.pageLayout.subMenu.onlySubheader.path, element: null },
	{ path: pageLayoutTypesPagesMenu.pageLayout.subMenu.onlyContent.path, element: null },
	{ path: pageLayoutTypesPagesMenu.blank.path, element: null },
	{ path: demoPagesMenu.login.path, element: null },
	{ path: demoPagesMenu.signUp.path, element: null },
	{ path: demoPagesMenu.page404.path, element: null },
	{ path: demoPagesMenu.knowledge.subMenu.grid.path, element: null },
	
	{
		path: `*`,
		element: <DashboardHeader />,
	},
];

export default headers;
