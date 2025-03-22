import React, { useContext, useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../../menu';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Page from '../../../layout/Page/Page';
import CommonDashboardUserCard from './common/CommonDashboardUserCard';
import CommonDashboardMarketingTeam from './common/CommonDashboardMarketingTeam';
import CommonDashboardDesignTeam from './common/CommonDashboardDesignTeam';
import CommonDashboardRecentActivities from './common/CommonDashboardRecentActivities';
import CommonDashboardUserIssue from './common/CommonDashboardUserIssue';
import CommonDashboardSalesByStore from './common/CommonDashboardSalesByStore';
import CommonDashboardWaitingAnswer from './common/CommonDashboardWaitingAnswer';
import CommonDashboardTopSeller from './common/CommonDashboardTopSeller';
import ThemeContext from '../../../contexts/themeContext';
import api from "../../../Api/api";

const DashboardPage = () => {
	const { mobileDesign } = useContext(ThemeContext);
	/**
	 * Tour Start
	 */
	const { setIsOpen } = useTour();
	useEffect(() => {
		if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
			setTimeout(() => {
				setIsOpen(true);
				localStorage.setItem('tourModalStarted', 'shown');
			}, 7000);
		}
		return () => { };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	//const { themeStatus } = useDarkMode();

	//const [activeTab, setActiveTab] = useState<TTabs>(TABS.YEARLY);






	return (
		<PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-xl-4'>
						<CommonDashboardUserCard />
					</div>
					<div className='col-xl-4'>
						<CommonDashboardMarketingTeam />
					</div>
					<div className='col-xl-4'>
						<CommonDashboardDesignTeam />
					</div>

					<div className='col-xxl-3'>
						<CommonDashboardRecentActivities />
					</div>
					<div className='col-xxl-3'>
						<CommonDashboardUserIssue />
					</div>

					<div className='col-xxl-8'>
						<CommonDashboardSalesByStore />
					</div>

					<div className='col-xxl-4 col-xl-6'>
						<CommonDashboardWaitingAnswer />
					</div>

					<div className='col-xxl-8'>
						<CommonDashboardTopSeller />
					</div>
					<input placeholder='nhap zo' name='check'/>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
