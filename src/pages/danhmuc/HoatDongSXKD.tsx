import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';

import Page from '../../layout/Page/Page';
import ThemeContext from '../../contexts/themeContext';
import SubHeaderDM from './SubHeaderDM';
import AddAndEditModal from '../../components/Modal/AddAndEditModal';
import TaiKhoanForm from './Form/TaiKhoanForm';
import DataTable, { FunctionRef } from '../../components/table/DataTable';
import HoatDongSXKDForm from './Form/HoatDongSXKDForm';
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
    return (<>

        <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
                <SubHeaderDM link1='' link2='/danhmuc/danhmuc/loai=DANHMUCHOATDONGSXKD' title1='Danh Mục' title2='Hoạt Động SXKD'
                    listButton={<AddAndEditModal
                        nameButton='Thêm mới'
                        title='Hoạt Động SXKD'
                        content={<HoatDongSXKDForm idItem={idItemCurrent.current} reloadGrid={dataGridRef.current?.reloadGrid} setOpenModal={setIsOpenModal} />} isOpen={isOpenModal} setIsOpen={setIsOpenModal}
                        includeButton={true} />}
                    exportToExcel={dataGridRef.current?.exportToExcel}
                />
                <Page container='fluid'>
                    <div className='row'>
                        <div className='col-xxl-12'>
                            <DataTable
                                url={`${import.meta.env.VITE_API_URL}/danhmuc`}
                                apiUrlGetTitle={`/danhmuc/danhmuc?loai=DANHMUCHOATDONGSXKD`}
                                loai='DANHMUCHOATDONGSXKD'
                                keyField='ID'
                                ref={dataGridRef}
                                idItemCurrent={idItemCurrent}
                                setIsOpenModal={setIsOpenModal}
                            />
                        </div>
                    </div>
                </Page>

        </PageWrapper>

    </>
    );
};

export default DanhMucDoiTuong;