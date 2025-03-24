import { useContext, useEffect } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../../menu';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Page from '../../../layout/Page/Page';
import ThemeContext from '../../../contexts/themeContext';
import DataGrid from '../../../components/table/DataGrid';
import SubHeader, {
    SubHeaderLeft,
    SubHeaderRight,
    SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Button, { ButtonGroup } from '../../../components/bootstrap/Button';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import AddAndEditModal from '../../../components/Modal/AddAndEditModal';
import SubHeaderDM from '../SubHeaderDM';

const DanhMucDoiTuong = () => {
    const { mobileDesign } = useContext(ThemeContext);
    const { setIsOpen } = useTour();
    useEffect(() => {
        if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
            setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem('tourModalStarted', 'shown');
            }, 7000);
        }
        return () => { };
    }, []);

    return (
        // <KeepAlive>
        <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
            <SubHeaderDM title1='Danh Mục' title2='Danh Mục Đối Tượng' link1='' link2='/danhmuc/danhmuc?loai=danhmuctendonvi' />
            <Page container='fluid'>
                <div className='row'>
                    <div className='col-xxl-12'>
                        {/* <DataGrid
                            apiUrlForAll={`${import.meta.env.VITE_API_URL}/danhmuc`}
                            apiUrlGetTitle={`/danhmuc/danhmuc?loai=danhmuctendonvi`}
                            loai='danhmuctendonvi' /> */}
                    </div>


                </div>
            </Page>
        </PageWrapper>
        //</KeepAlive>
    );
};

export default DanhMucDoiTuong;