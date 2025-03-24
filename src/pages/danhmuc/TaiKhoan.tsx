import { useContext, useEffect, useState } from 'react';
import { useTour } from '@reactour/tour';
import { demoPagesMenu } from '../../menu';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';

import Page from '../../layout/Page/Page';
import ThemeContext from '../../contexts/themeContext';
import DataGrid from '../../components/table/DataGrid';
import Card, {
    CardActions,
    CardBody,
    CardCodeView,
    CardFooter,
    CardFooterLeft,
    CardFooterRight,
    CardHeader,
    CardLabel,
    CardSubTitle,
    CardTitle,
} from '../../components/bootstrap/Card';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Textarea from '../../components/bootstrap/forms/Textarea';
import SubHeaderDM from './SubHeaderDM';
import AddAndEditModal from '../../components/Modal/AddAndEditModal';
import Select from '../../components/bootstrap/forms/Select';
import { useFormik } from 'formik';
import Option, { Options } from '../../components/bootstrap/Option';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import SubHeader, {
    SubHeaderLeft,
    SubHeaderRight,
    SubheaderSeparator,
} from '../../layout/SubHeader/SubHeader';
import Breadcrumb from '../../components/bootstrap/Breadcrumb';
import Button from '../../components/bootstrap/Button';
const DanhMucDoiTuong = () => {
    const { mobileDesign } = useContext(ThemeContext);
    const { setIsOpen } = useTour();
      const [isOpenModal,setIsOpenModal] = useState(false);
    
    useEffect(() => {
        if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
            setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem('tourModalStarted', 'shown');
            }, 7000);
        }
        return () => { };
    }, []);
    const formikTwoWay = useFormik({
        initialValues: {
            exampleSelectTwoWay: '',
        },
        onSubmit: (values) => {
            alert(JSON.stringify(values, null, 2));
        },
    });
    const inlineCheckboxes = useFormik({
        initialValues: {
            checkOne: true,
            checkTwo: false,
            checkThree: false,
        },
        onSubmit: () => { },
    });
    const getContenModal = (idItem: number, url: string) => {
        if (idItem != 0) {

        }
        return (
            <div className='col-lg-12'>
                <form className='row g-4 w-100'>
                    <div className='col-12'>
                        <FormGroup
                            id={`exampleTypesPlaceholder`}
                            label="SHTK"
                            isColForLabel
                            labelClassName='col-sm-3 text-capitalize'
                            childWrapperClassName='col-sm-9'>
                            <Input
                                type='text'
                                // autoComplete={
                                //     (['password', 'email'].includes(type)
                                //         ? (type === 'password' &&
                                //                 'current-password') ||
                                //             (type === 'email' && 'username')
                                //         : undefined) as string
                                // }
                                placeholder={``}
                                aria-label='.form-control-lg example'
                            />
                        </FormGroup>
                    </div>
                    <div className='col-12'>
                        <FormGroup
                            id={`exampleTypesPlaceholder`}
                            label="Tên tài khoản"

                            isColForLabel
                            labelClassName='col-sm-3 text-capitalize'
                            childWrapperClassName='col-sm-9'>
                            <Input
                                type='text'
                                // autoComplete={
                                //     (['password', 'email'].includes(type)
                                //         ? (type === 'password' &&
                                //                 'current-password') ||
                                //             (type === 'email' && 'username')
                                //         : undefined) as string
                                // }
                                placeholder={``}
                                aria-label='.form-control-lg example'
                            />
                        </FormGroup>
                    </div>
                    <div className='col-12'>
                        <FormGroup
                            id='exampleSelectTwoWay'
                            label='Cấp tài khoản'
                            labelClassName='col-sm-3 text-capitalize'
                            isColForLabel
                            childWrapperClassName='col-sm-9'>
                            <Select
                                ariaLabel='Default select example'
                                placeholder=''
                                //onChange={formikTwoWay.handleChange}
                                value={
                                    formikTwoWay.values
                                        .exampleSelectTwoWay
                                }>
                                <Options list={SELECT_OPTIONS} />
                            </Select>
                        </FormGroup>
                    </div>
                    <div className='col-12'>
                        <FormGroup
                            id='exampleSelectTwoWay'
                            label='Cấp tài khoản'
                            labelClassName='col-sm-3 text-capitalize'
                            isColForLabel
                            childWrapperClassName='col-sm-9'>
                            <ChecksGroup isInline>
                                <Checks
                                    type='checkbox'
                                    id='inlineCheckOne'
                                    label='One'
                                    name='checkOne'
                                    onChange={inlineCheckboxes.handleChange}
                                    checked={
                                        inlineCheckboxes.values.checkOne
                                    }
                                />
                                <Checks
                                    type='checkbox'
                                    id='inlineCheckTwo'
                                    label='Two'
                                    name='checkTwo'
                                    onChange={inlineCheckboxes.handleChange}
                                    checked={
                                        inlineCheckboxes.values.checkTwo
                                    }
                                />
                                <Checks
                                    type='checkbox'
                                    id='inlineCheckThree'
                                    label={
                                        <>
                                            Three <sup>(disabled)</sup>
                                        </>
                                    }
                                    name='checkThree'
                                    onChange={inlineCheckboxes.handleChange}
                                    checked={
                                        inlineCheckboxes.values.checkThree
                                    }
                                    disabled
                                />
                            </ChecksGroup>
                        </FormGroup>
                    </div>
                    <div className='col-12'>
                        <FormGroup
                            id='exampleSelectTwoWay'
                            label='Loại tài khoản'
                            labelClassName='col-sm-3 text-capitalize'
                            isColForLabel
                            childWrapperClassName='col-sm-9'>
                            <Select
                                ariaLabel='Default select example'
                                placeholder='Chọn lọa tài khoản'
                                //onChange={formikTwoWay.handleChange}
                                value={
                                    formikTwoWay.values
                                        .exampleSelectTwoWay
                                }>
                                <Options list={SELECT_OPTIONS} />
                            </Select>
                        </FormGroup>
                    </div>
                    <div className='col-12'>
                        <FormGroup
                            id='exampleTypesPlaceholder--textarea'
                            label='Ghi chú'
                            isColForLabel
                            labelClassName='col-sm-3 text-capitalize'
                            childWrapperClassName='col-sm-9'>
                            <Textarea
                                placeholder=''
                                aria-label='.form-control-lg example'
                            />
                        </FormGroup>
                    </div>
                </form>
            </div>
        );
    }
    return (
        // <KeepAlive>
        <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
            <SubHeaderDM link1='' link2='/danhmuc/danhmuc/loai=danhmuctaikhoan' title1='Danh Mục' title2='Danh Mục Tài Khoản' 
            listButton={<AddAndEditModal
                        nameButton='Thêm mới'
                        title='Thêm Mới Tài Khoản'
                        content={getContenModal(0, '')} isOpen={isOpenModal} setIsOpen={setIsOpenModal}/>}
            />

            <Page container='fluid'>
                <div className='row'>
                    <div className='col-xxl-12'>
                        <DataGrid
                            apiUrlForAll={`${import.meta.env.VITE_API_URL}/danhmuc`}
                            apiUrlGetTitle={`/danhmuc/danhmuc?loai=danhmuctaikhoan`}
                            loai='danhmuctaikhoan' 
                            getContentModal={getContenModal}
                            />
                    </div>

                </div>
            </Page>
        </PageWrapper>
        //</KeepAlive>
    );
};
export const SELECT_OPTIONS = [
    { value: 1, text: 'One' },
    { value: 2, text: 'Two' },
    { value: 3, text: 'Three' },
    { value: 4, text: 'Four' },
    { value: 5, text: 'Five' },
    { value: 6, text: 'Six' },
];
export default DanhMucDoiTuong;