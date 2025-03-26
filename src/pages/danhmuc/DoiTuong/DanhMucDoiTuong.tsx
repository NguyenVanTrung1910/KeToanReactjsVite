import { useContext, useEffect, useState } from 'react';
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
import DataGrid from '../../../components/table/DataGrid';
import Api from '../../../Api/api';
import { FastField, Form, Formik } from 'formik';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Select from '../../../components/bootstrap/forms/Select';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import Textarea from '../../../components/bootstrap/forms/Textarea';

const DanhMucDoiTuong = () => {
    const { mobileDesign } = useContext(ThemeContext);
    const { setIsOpen } = useTour();
    const [isOpenModal, setIsOpenModal] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('tourModalStarted') !== 'shown' && !mobileDesign) {
            setTimeout(() => {
                setIsOpen(true);
                localStorage.setItem('tourModalStarted', 'shown');
            }, 7000);
        }
        return () => { };
    }, []);
    const GetContenDoiTuongModal = (idItem: number, url?: string) => {
        const [listKhuVuc, setListKhuVuc] = useState<string[]>([]);
        const [initialValues, setInitialValues] = useState({
            cboTENNHOM: "",
            txtMASOTHUE: "",
            txtMADONVI: '',
            txtTENDONVI: "",
            txtDIACHI: "",
            txtDIENTHOAI: '',
            txtFAX: '',
            txtEMAIL: '',
            cboTENPHONG: '',
            cboTENQUANLY: '',
            cboTENNHOMKHUVUC: '',
            cboTENKHUVUC: '',
            txtTENNGANHANG: '',
            cboSOTAIKHOAN: '',
            chkNHANVIEN: false,
            chkTHEODOIHOADON: false,
            numHANMUCTHANHTOAN: 0,
            numHANMUCDUNO: 0,
            txtGHICHU: "",

        });
        useEffect(() => {
            const getListKhuVuc = async () => {
                const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetListKhuVuc`,{
                    params: {
                        dk:'sss'
                    }
                });
                if (true) {
                    const listKhuVuc = response.data.data.map((item: any) => item.TENKHUVUC);
                    setListKhuVuc(listKhuVuc);
                }
            }

            if (idItem !== 0) {
                const fetchData = async () => {
                    try {
                        const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetDoiTuongForEdit`, {
                            params: {
                                TenBang: "DANHMUCTENDONVI",
                                MaSo: "MADONVI",
                                iddoituong: idItem.toString(),
                                madoituong: "ANA"
                            }
                        });

                        if (response.data && response.data.data.length > 0) {
                            const apiData = response.data.data[0]; // Lấy object đầu tiên từ mảng data
                            setInitialValues({
                                cboTENNHOM: "",
                                txtMASOTHUE: "",
                                txtMADONVI: '',
                                txtTENDONVI: "",
                                txtDIACHI: "",
                                txtDIENTHOAI: '',
                                txtFAX: '',
                                txtEMAIL: '',
                                cboTENPHONG: '',
                                cboTENQUANLY: '',
                                cboTENNHOMKHUVUC: '',
                                cboTENKHUVUC: '',
                                txtTENNGANHANG: '',
                                cboSOTAIKHOAN: '',
                                chkNHANVIEN: false,
                                chkTHEODOIHOADON: false,
                                numHANMUCTHANHTOAN: 0,
                                numHANMUCDUNO: 0,
                                txtGHICHU: "",
                            });
                        }
                    } catch (error) {
                        console.error("Lỗi khi lấy dữ liệu:", error);
                    }
                };
                fetchData(); // Gọi hàm async
            }
            // console.log(123232323)
            getListKhuVuc();
        }, [idItem]); // Chạy lại khi `idItem` thay đổi

        const handleSubmit = async (values: any) => {
            try {
                const formatSQLInsert = (values: any) => {
                    if (idItem > 0)
                        return `EDITOK***GHICHU=N'${values.ghiChu}',
                        SHTK=N'${values.shtk}',
                        TENTAIKHOAN=N'${values.tenTaiKhoan}',
                        BATBUOC=${values.chkBATBUOC ? 1 : 0},
                        CHITIET=${values.chkCHITIET ? 1 : 0},
                        VATTU=${values.chkVATTU ? 1 : 0},
                        HOPDONG=${values.chkHOPDONG ? 1 : 0},
                        KHOANMUC=${values.chkKHOANMUC ? 1 : 0},
                        HDSXKD=${values.chkHDSXKD ? 1 : 0},
                        SODU2BEN=${values.chkSODU2BEN ? 1 : 0},
                        GIATHANH=${values.chkGIATHANH ? 1 : 0},
                        CONGTRINH=${values.chkCONGTRINH ? 1 : 0},
                        PHONGBAN=${values.chkPHONGBAN ? 1 : 0},
                        HIENCCDC=${values.chkHIENCCDC ? 1 : 0},
                        CONGCU=${values.chkCONGCU ? 1 : 0},
                        TENNGANHANG=NULL,
                        SOTAIKHOAN=NULL,
                        CAPTK=N'${values.capTaiKhoan}',
                        LOAITAIKHOAN=N'${values.loaiTaiKhoan}'
                        WHERE ID=${idItem}`;
                    return `ADDNEWOK***GHICHU, SHTK, TENTAIKHOAN, BATBUOC, CHITIET, VATTU, HOPDONG, KHOANMUC, HDSXKD, SODU2BEN, GIATHANH, CONGTRINH, PHONGBAN, HIENCCDC, CONGCU, TENNGANHANG, SOTAIKHOAN, CAPTK, LOAITAIKHOAN) VALUESOK***N'${values.ghiChu}',N'${values.shtk}',N'${values.tenTaiKhoan}',${values.chkBATBUOC ? 1 : 0}, ${values.chkCHITIET ? 1 : 0}, ${values.chkVATTU ? 1 : 0}, ${values.chkHOPDONG ? 1 : 0}, ${values.chkKHOANMUC ? 1 : 0}, ${values.chkHDSXKD ? 1 : 0}, ${values.chkSODU2BEN ? 1 : 0}, ${values.chkGIATHANH ? 1 : 0}, ${values.chkCONGTRINH ? 1 : 0}, ${values.chkPHONGBAN ? 1 : 0}, ${values.chkHIENCCDC ? 1 : 0}, ${values.chkCONGCU ? 1 : 0}, ${values.tenNganHang ? `N'${values.tenNganHang}'` : "NULL"}, ${values.soTaiKhoan ? `N'${values.soTaiKhoan}'` : "NULL"}, N'${values.capTaiKhoan}', N'${values.loaiTaiKhoan}')`;
                };
                const sqlQuery = formatSQLInsert(values);
                console.log(sqlQuery);
                const response = await Api.post(
                    `${import.meta.env.VITE_API_URL}/danhmuc/SaveAddOrEditDanhMuc`,
                    null,  // Body phải là `null` vì dữ liệu gửi qua query
                    {
                        params: {
                            tbl: "DANHMUCTAIKHOAN",
                            sqltxt: sqlQuery, // Đảm bảo giá trị hợp lệ
                            masoOld: "1111",
                            masoNew: "1111"
                        }
                    }
                );

                if (response.status == 200) {
                    if (response.data.success === false) {
                        showNotification('', response.data.message, 'warning')
                    } else {
                        if (idItem > 0) showNotification('', 'Sửa thành công', 'success')
                        else showNotification('', 'Thêm thành công', 'success')
                    }
                } else {
                    showNotification('', 'Đã xảy ra lỗi trong quá trình thêm mới', 'danger')
                }


            } catch (error) {
                console.error("Lỗi khi gửi dữ liệu:", error);
            }
        };
        const handleAddMore = (resetForm: () => void) => {
            resetForm(); // Reset lại form về giá trị ban đầu
            // setInitialValues({
            //     shtk: "",
            //     tenTaiKhoan: "",
            //     capTaiKhoan: '',
            //     loaiTaiKhoan: "",
            //     ghiChu: "",
            //     chkBATBUOC: false,
            //     chkCHITIET: false,
            //     chkVATTU: false,
            //     chkHOPDONG: false,
            //     chkKHOANMUC: false,
            //     chkHDSXKD: false,
            //     chkSODU2BEN: false,
            //     chkGIATHANH: false,
            //     chkCONGTRINH: false,
            //     chkPHONGBAN: false,
            //     chkHIENCCDC: false,
            //     chkCONGCU: false,
            // })
        };

        return (
            <Formik
                enableReinitialize
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {({ setFieldValue, values, handleChange, resetForm }) => (
                    <Form className="row g-4 w-100">
                        <div className="col-12">
                            <FormGroup id="cboTENNHOM" label="Nhóm đối tượng" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                <Select
                                    ariaLabel="Nhóm đối tượng"
                                    name="cboTENNHOM"
                                    value={values.cboTENNHOM} // Đã đảm bảo là string
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setFieldValue("cboTENNHOM", e.target.value);
                                    }}
                                >
                                    <option value="">-- Chọn nhóm đối tượng --</option>
                                    <option>Cán bộ, nhân viên trong công ty</option>
                                    <option>Nhóm dùng chung</option>
                                    <option>Nhóm khách hàng 131</option>
                                    <option>Nhóm nhà cung cấp </option>
                                    <option>Nhóm phải thu khác</option>
                                </Select>
                            </FormGroup>
                        </div>
                        <div className="col-12">
                            <FastField name="txtMASOTHUE">
                                {({ field }: any) => (
                                    <FormGroup id="txtMASOTHUE" label="Mã số thuế" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-12">
                            <FastField name="txtMADONVI">
                                {({ field }: any) => (
                                    <FormGroup id="txtMADONVI" label="Mã đối tượng" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-12">
                            <FastField name="txtTENDONVI">
                                {({ field }: any) => (
                                    <FormGroup id="txtTENDONVI" label="Tên đối tượng" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-12">
                            <FastField name="txtDIACHI">
                                {({ field }: any) => (
                                    <FormGroup id="txtDIACHI" label="Địa chỉ" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-md-7">
                            <FastField name="txtDIENTHOAI">
                                {({ field }: any) => (
                                    <FormGroup id="txtDIENTHOAI" label="Điện thoại" isColForLabel labelClassName="col-md-5 text-capitalize" childWrapperClassName="col-md-7">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-md-5">
                            <FastField name="txtFAX">
                                {({ field }: any) => (
                                    <FormGroup id="txtFAX" label="Fax" isColForLabel labelClassName="col-md-3 text-capitalize" childWrapperClassName="col-sm-9">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-12">
                            <FastField name="txtEMAIL">
                                {({ field }: any) => (
                                    <FormGroup id="txtEMAIL" label="Email" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-12">
                            <FormGroup id="cboTENPHONG" label="Phòng ban" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                <Select
                                    ariaLabel="Phòng ban"
                                    name="cboTENPHONG"
                                    value={values.cboTENPHONG} // Đã đảm bảo là string
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setFieldValue("cboTENPHONG", e.target.value);
                                    }}
                                >
                                    <option value="">-- Chọn phòng ban --</option>
 
                                </Select>
                            </FormGroup>
                        </div>
                        <div className="col-12">
                            <FormGroup id="cboTENQUANLY" label="Nhân viên quản lý" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                <Select
                                    ariaLabel="Nhân viên quản lý"
                                    name="cboTENQUANLY"
                                    value={values.cboTENPHONG} // Đã đảm bảo là string
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setFieldValue("cboTENQUANLY", e.target.value);
                                    }}
                                >
                                    <option value="">-- Chọn nhân viên quản lý --</option>
                                    {Array.from({ length: 7 }, (_, i) => (
                                        <option key={i + 1} value={(i + 1).toString()}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </Select>
                            </FormGroup>
                        </div>
                        <div className="col-md-7">
                            <FormGroup id="cboTENNHOMKHUVUC" label="Nhóm khu vực" isColForLabel labelClassName="col-md-5 text-capitalize" childWrapperClassName="col-md-7">
                                <Select
                                
                                    ariaLabel="Phòng ban"
                                    name="cboTENNHOMKHUVUC"
                                    value={values.cboTENNHOMKHUVUC} // Đã đảm bảo là string
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setFieldValue("cboTENNHOMKHUVUC", e.target.value);
                                    }}
                                >
                                    <option value="">-- Chọn nhóm khu vực --</option>
                                    {listKhuVuc.map((loai, index) => (
                                        <option key={index} value={loai}>
                                            {loai}
                                        </option>
                                    ))}
                                </Select>
                            </FormGroup>
                        </div>
                        <div className="col-md-5">
                            <FormGroup id="cboTENKHUVUC" label="Khu vực" isColForLabel labelClassName="col-md-3 text-capitalize" childWrapperClassName="col-md-9">
                                <Select
                                    ariaLabel="Khu vực"
                                    name="cboTENKHUVUC"
                                    value={values.cboTENPHONG} // Đã đảm bảo là string
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setFieldValue("cboTENKHUVUC", e.target.value);
                                    }}
                                >
                                    <option value="">-- Chọn khu vực --</option>

                                </Select>
                            </FormGroup>
                        </div>
                        <div className="col-md-7">
                            <FastField name="txtTENNGANHANG">
                                {({ field }: any) => (
                                    <FormGroup id="txtTENNGANHANG" label="Nơi mở ngân hàng" isColForLabel labelClassName="col-md-5 text-capitalize" childWrapperClassName="col-md-7">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-md-5">
                            <FormGroup id="cboSOTAIKHOAN" label="Số tài khoản" isColForLabel labelClassName="col-md-4 text-capitalize" childWrapperClassName="col-md-8">
                                <Select
                                    ariaLabel="Số tài khoản"
                                    name="cboSOTAIKHOAN"
                                    value={values.cboSOTAIKHOAN} // Đã đảm bảo là string
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        setFieldValue("cboSOTAIKHOAN", e.target.value);
                                    }}
                                >
                                    <option value="">-- Chọn số tài khoản --</option>
                                    {Array.from({ length: 7 }, (_, i) => (
                                        <option key={i + 1} value={(i + 1).toString()}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </Select>
                            </FormGroup>
                        </div>
                        <div className="col-12">
                            <FormGroup
                                id="exampleSelectTwoWay"
                                label=""
                                labelClassName="col-sm-3 text-capitalize"
                                isColForLabel
                                childWrapperClassName="col-sm-9">
                                <ChecksGroup isInline>
                                    <Checks
                                        type="checkbox"
                                        id="chkNHANVIEN"
                                        label="Là nhân viên"
                                        name="chkNHANVIEN"
                                        onChange={handleChange}
                                        checked={values.chkNHANVIEN}
                                    />
                                    <Checks
                                        type="checkbox"
                                        id="chkTHEODOIHOADON"
                                        label="Theo đối tượng"
                                        name="chkTHEODOIHOADON"
                                        onChange={handleChange}
                                        checked={values.chkTHEODOIHOADON}
                                    />
                                    
                                </ChecksGroup>
                            </FormGroup>
                        </div>
                        <div className="col-md-7">
                            <FastField name="numHANMUCTHANHTOAN">
                                {({ field }: any) => (
                                    <FormGroup id="numHANMUCTHANHTOAN" label="Số ngày thanh toán" isColForLabel labelClassName="col-md-5 text-capitalize" childWrapperClassName="col-md-7">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-md-5">
                            <FastField name="numHANMUCDUNO">
                                {({ field }: any) => (
                                    <FormGroup id="numHANMUCDUNO" label="Hạn mức dư nợ" isColForLabel labelClassName="col-md-5 text-capitalize" childWrapperClassName="col-md-7">
                                        <Input type="text" {...field} />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-12">
                            <FastField name="ghiChu">
                                {({ field }: any) => (
                                    <FormGroup id="ghiChu" label="Ghi chú" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                        <Textarea
                                            placeholder=''
                                            aria-label='.form-control-lg example'
                                            {...field}

                                        />
                                    </FormGroup>
                                )}
                            </FastField>
                        </div>
                        <div className="col-12 d-flex justify-content-end gap-2">
                            <Button color="info" icon="Save" type="submit">
                                Cất giữ
                            </Button>
                            <Button color='success' icon='Add' onClick={() => handleAddMore(resetForm)}>
                                Thêm tiếp
                            </Button>
                            <Button
                                color='danger'
                                //isOutline
                                className='border'
                                onClick={() => setIsOpenModal(false)}>
                                Đóng
                            </Button>
                        </div>


                    </Form>
                )}
            </Formik>
        );
    };
    return (
        // <KeepAlive>
        <PageWrapper title={demoPagesMenu.sales.subMenu.dashboard.text}>
            <SubHeaderDM link1='' link2='/danhmuc/danhmuc/loai=danhmuctendonvi' title1='Danh Mục' title2='Danh Mục Đối Tượng'
                listButton={<AddAndEditModal
                    nameButton='Thêm mới'
                    title='Thêm Mới Đối Tượng'
                    content={GetContenDoiTuongModal(0, '')} isOpen={isOpenModal} setIsOpen={setIsOpenModal}
                    includeButton={true} />}
            />
            <Page container='fluid'>
                <div className='row'>
                    <div className='col-xxl-12'>
                        {/* <DataGrid
                            apiUrlForAll={`${import.meta.env.VITE_API_URL}/danhmuc`}
                            apiUrlGetTitle={`/danhmuc/danhmuc?loai=danhmuctendonvi`}
                            loai='danhmuctendonvi' getContentModal={GetContenDoiTuongModal} /> */}
                    </div>


                </div>
            </Page>
        </PageWrapper>
        //</KeepAlive>
    );
};

export default DanhMucDoiTuong;