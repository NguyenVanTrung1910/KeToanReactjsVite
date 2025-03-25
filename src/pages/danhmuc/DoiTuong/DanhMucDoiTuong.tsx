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
import { Store } from 'react-notifications-component';
import showNotification from '../../../components/extras/showNotification';

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
    Store.addNotification({
        title: "Wonderful!",
        message: "teodosii@react-notifications-component",
        type: "success",
        insert: "top",
        container: "top-right",
        // animationIn: ["animate__animated", "animate__fadeIn"],
        // animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
            duration: 5000,
            onScreen: true
        }
    });
    Store.removeNotification('2');
    // notification = {
    //     title: "Wonderful!",
    //     message: "Configurable",
    //     type: "success",
    //     insert: "top",
    //     container: "top-right",
    //     animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
    //     animationOut: ["animate__animated animate__fadeOut"] // `animate.css v4` classes
    // };
    // Store.addNotification({
    //     ...notification,
    //     container: 'top-right'
    // })

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
                    <Button
                        color='primary'
                        isLight
                        icon='Notifications'
                        onClick={() => {
                            showNotification('', "trung dx sada asdas ad asda a asda ad a ada ad adasd");
                        }}>
                        Click
                    </Button>
                    <Button
                        color='success'
                        isLight
                        icon='Notifications'
                        onClick={() => {
                            showNotification('', 'sádasdasdsa', 'success');
                        }}>
                        Success
                    </Button>
                    <Button
                        color='danger'
                        isLight
                        icon='Notifications'
                        onClick={() => {
                            showNotification('', 'askjdsajk  asdhkas daskjd haskdasdkjasdhsakjdh ', 'danger');
                        }}>
                        Danger
                    </Button>
                    <div className='col-auto'>
                        <Button
                            color='warning'
                            isLight
                            icon='Notifications'
                            onClick={() => {
                                showNotification('', 'asjkdsahjkdhbaskjd asasd haskjdh ákdhska', 'warning');
                            }}>
                            Warning
                        </Button>
                    </div>

                </div>
            </Page>
        </PageWrapper>
        //</KeepAlive>
    );
};

export default DanhMucDoiTuong;