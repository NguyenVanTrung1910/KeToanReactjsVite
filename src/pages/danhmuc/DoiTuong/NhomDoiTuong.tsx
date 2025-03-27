import { useContext, useEffect, useRef, useState } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../../menu';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Page from '../../../layout/Page/Page';
import ThemeContext from '../../../contexts/themeContext';
import SubHeaderDM from '../SubHeaderDM';
import AddAndEditModal from '../../../components/Modal/AddAndEditModal';
import TaiKhoanForm from '../Form/TaiKhoanForm';
import DataTable from '../../../components/table/DataTable';
const NhomDoiTuong = () => {
    const { mobileDesign } = useContext(ThemeContext);
    const { setIsOpen } = useTour();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const idItemCurrent = useRef(1);

    useEffect(() => {
        if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
            setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem('tourModalStarted', 'shown');
            }, 7000);
        }
        return () => { };
    }, []);
    console.log('Nhom doi tuong')
    console.log(idItemCurrent.current)
    return (
        // <KeepAlive>
        <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
            <SubHeaderDM title1='Danh Mục' title2='Nhóm Đối Tượng' link1='' link2='/danhmuc/danhmuc?loai=danhmucnhomdonvi' />

            <Page container='fluid'>
                <div className='row'>
                    <div className='col-xxl-12'>
                        <DataTable keyField='ID' 
                            url={`${import.meta.env.VITE_API_URL}/danhmuc`}
                            apiUrlGetTitle={`/danhmuc/danhmuc?loai=danhmucnhomdonvi`}
                            loai='danhmucnhomdonvi' idItemCurrent={idItemCurrent} setIsOpenModal={setIsOpenModal}/>
                    </div>

                </div>
                <AddAndEditModal
                    content={<TaiKhoanForm idItem={idItemCurrent.current} setOpenModal={setIsOpenModal}/>}
                    includeButton={true} isOpen={isOpenModal} setIsOpen={setIsOpenModal} title='' nameButton='' />
            </Page>

        </PageWrapper>
        //</KeepAlive>
    );
};

export default NhomDoiTuong;