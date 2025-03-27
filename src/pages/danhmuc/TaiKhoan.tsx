import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';

import Page from '../../layout/Page/Page';
import ThemeContext from '../../contexts/themeContext';
import DataGrid from '../../components/table/DataGrid';
import SubHeaderDM from './SubHeaderDM';
import AddAndEditModal from '../../components/Modal/AddAndEditModal';
import Api from "../../Api/api";
import { FastField, Form, Formik } from "formik";
import FormGroup from "../../components/bootstrap/forms/FormGroup";
import Input from "../../components/bootstrap/forms/Input";
import Select from "../../components/bootstrap/forms/Select";
import Checks, { ChecksGroup } from "../../components/bootstrap/forms/Checks";
import Textarea from "../../components/bootstrap/forms/Textarea";
import showNotification from '../../components/extras/showNotification';
import Button, { ButtonGroup } from '../../components/bootstrap/Button';
import TaiKhoanForm from './Form/TaiKhoanForm';
const DanhMucDoiTuong = () => {
    const { mobileDesign } = useContext(ThemeContext);
    const { setIsOpen } = useTour();
    const [isOpenModal, setIsOpenModal] = useState(false);
    const idItemCurrent = useRef(0);

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
            <SubHeaderDM link1='' link2='/danhmuc/danhmuc/loai=danhmuctaikhoan' title1='Danh Mục' title2='Danh Mục Tài Khoản'
                listButton={<AddAndEditModal
                    nameButton='Thêm mới'
                    title='Danh Mục Tài Khoản'
                    content={<TaiKhoanForm idItem={idItemCurrent.current} setOpenModal={setIsOpenModal} />} isOpen={isOpenModal} setIsOpen={setIsOpenModal}
                    includeButton={true} />}
            />

            <Page container='fluid'>
                <div className='row'>
                    <div className='col-xxl-12'>
                        <DataGrid
                            apiUrlForAll={`${import.meta.env.VITE_API_URL}/danhmuc`}
                            apiUrlGetTitle={`/danhmuc/danhmuc?loai=danhmuctaikhoan`}
                            loai='danhmuctaikhoan'
                            idItemCurrent={idItemCurrent} setOpenModal={setIsOpenModal} isOpenModal={isOpenModal}
                        />
                    </div>

                </div>
            </Page>
        </PageWrapper>
    </>
        //</KeepAlive>
    );
};

export default DanhMucDoiTuong;