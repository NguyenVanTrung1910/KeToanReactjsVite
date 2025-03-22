import React, { useContext, useEffect, useState } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../../menu';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Page from '../../../layout/Page/Page';
import { KeepAlive } from "react-activation";

import CommonDashboardSalesByStore from './common/CommonDashboardSalesByStore';
import CommonDashboardWaitingAnswer from './common/CommonDashboardWaitingAnswer';
import CommonDashboardTopSeller from './common/CommonDashboardTopSeller';
import ThemeContext from '../../../contexts/themeContext';
// import DataJson from '../../../components/table/DataJson';
// import LeftTool from '../../_layout/_tools/LeftTool';
import ScrollableTabs from '../../_layout/_headers/ScrollableTabs';
import Carousels from '../../../components/bootstrap/Carousel'
import DataTable from "../../../components/table/DataTable";
import api from "../../../Api/api";
import GetDataForTable from '../../../components/table/GetDataForTable';
const HomePage = () => {
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
    return (
        // <KeepAlive>
            <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
                <Page container='fluid'>
                    <div className='row'>
                        <div className='col-xxl-12'>
                            <GetDataForTable apiUrlForAll='https://localhost:44336/api/danhmuc' apiUrlGetTitle='/danhmuc/GetAllItem?loai=NOIDUNGCHUNGTU' loai='NOIDUNGCHUNGTU'/>
                        </div>
                    
                    </div>
                </Page>
            </PageWrapper>
        //</KeepAlive>
    );
};

export default HomePage;
