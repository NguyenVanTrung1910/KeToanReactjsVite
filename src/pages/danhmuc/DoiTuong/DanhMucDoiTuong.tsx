import { useContext, useEffect, useRef, useState } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../../menu';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Page from '../../../layout/Page/Page';
import ThemeContext from '../../../contexts/themeContext';
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
import DanhMucDoiTuongForm from '../Form/DanhMucDoiTuongForm';
import DataTable, { FunctionRef } from '../../../components/table/DataTable';

const DanhMucDoiTuong = () => {
    const { mobileDesign } = useContext(ThemeContext);
    const { setIsOpen } = useTour();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const idItemCurrent = useRef(0);
    const dataGridRef = useRef<FunctionRef | null>(null);

    useEffect(() => {
        if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
            setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem('tourModalStarted', 'shown');
            }, 7000);
        }
        return () => { };
    }, []);
    if (!isOpenModal)
        idItemCurrent.current = 0
    
    return (
        // <KeepAlive>
        <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
            <SubHeaderDM link1='' link2='/danhmuc/danhmuc/loai=danhmuctaikhoan' title1='Danh Mục' title2='Danh Mục Tài Khoản'
                listButton={<AddAndEditModal
                    nameButton='Thêm mới'
                    title='Danh Mục Tài Khoản'
                    content={<DanhMucDoiTuongForm idItem={idItemCurrent.current} reloadGrid={dataGridRef.current?.reloadGrid} setOpenModal={setIsOpenModal} />} isOpen={isOpenModal} setIsOpen={setIsOpenModal}
                    includeButton={true} />}
                exportToExcel={dataGridRef.current?.exportToExcel}

            />
            <Page container='fluid'>
                <div className='row'>
                    <div className='col-xxl-12'>
                        <DataTable
                            url={`${import.meta.env.VITE_API_URL}/danhmuc`}
                            apiUrlGetTitle={`/danhmuc/danhmuc?loai=danhmuctendonvi`}
                            loai='danhmuctendonvi'
                            idItemCurrent={idItemCurrent} setIsOpenModal={setIsOpenModal} keyField='ID'
                        />
                    </div>


                </div>
            </Page>
        </PageWrapper>
        //</KeepAlive>
    );
};

export default DanhMucDoiTuong;