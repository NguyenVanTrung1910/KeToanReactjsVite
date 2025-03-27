import { useEffect, useRef, useState } from "react";
import Api from "../../../Api/api";
import { FastField, Form, Formik } from "formik";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Select from "../../../components/bootstrap/forms/Select";
import Checks, { ChecksGroup } from "../../../components/bootstrap/forms/Checks";
import Textarea from "../../../components/bootstrap/forms/Textarea";
import showNotification from "../../../components/extras/showNotification";
import Button from "../../../components/bootstrap/Button";
interface DanhMucDoiTuongFormProps {
    idItem: number, url?: string, setOpenModal: (status: boolean) => void;
    reloadGrid?: () => void;

}

const DanhMucDoiTuongForm: React.FC<DanhMucDoiTuongFormProps> = ({ idItem, url, setOpenModal,reloadGrid }) => {
    const [listKhuVuc, setListKhuVuc] = useState<string[]>([]);
    const defaultValue = {
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

    };
    const [initialValues, setInitialValues] = useState(defaultValue);
    const maOld = useRef('ANA');
    const maNew = useRef(0);
    const getListKhuVuc = async (selectedValue: string) => {
        try {
            const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetListKhuVuc`, {
                params: { dk: selectedValue } // Truyền giá trị đã chọn vào API
            });

            if (response.data && response.data.data) {
                const loaiTaiKhoanList = response.data.data.map((item: any) => item.TENKHUVUC);
                setListKhuVuc(loaiTaiKhoanList);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách khu vực:", error);
        }
    };
    useEffect(() => {

        if (idItem !== 0) {
            const fetchData = async () => {
                try {
                    const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetDoiTuongForEdit`, {
                        params: {
                            TenBang: "DANHMUCTENDONVI",
                            MaSo: "MADONVI",
                            iddoituong: idItem.toString(),
                            madoituong: maOld.current
                        }
                    });
                    if (response.data && response.data.data.length > 0) {
                        const apiData = response.data.data[0]; // Lấy object đầu tiên từ mảng data
                        // const validCapTaiKhoan = [1, 2, 3, 4, 5, 6, 7].includes(apiData.CAPTK)
                        if (apiData) {
                            const formattedData = Object.keys(initialValues).reduce((acc, key) => {
                                const newKey = key.substring(3).toUpperCase();
                                return {
                                    ...acc,
                                    [key]: apiData[newKey] ?? initialValues[key as keyof typeof defaultValue], // Nếu API không có dữ liệu thì giữ giá trị mặc định
                                };
                            }, {} as Record<string, any>);
                            setInitialValues((prev) => ({
                                ...prev,
                                ...formattedData,
                            }));

                        }
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu:", error);
                }
            };
            fetchData(); // Gọi hàm async
        }
    }, [idItem]);
    const handleSubmit = async (values: any) => {
        try {
            const formatSQLInsert = (values: any) => {
                const formattedValues = Object.entries(values).reduce((acc, [key, value]) => {
                    const newKey = key.substring(3); // Bỏ 3 ký tự đầu (txt, num, chk)
                    acc[newKey] = value;
                    return acc;
                }, {} as Record<string, any>);
                const fields = Object.keys(formattedValues);
                const valuesSQL = fields.map(field => {
                    const val = formattedValues[field];
                    if (typeof val === "boolean") return `${field}=${val ? 1 : 0}`; // Boolean -> 1 | 0
                    if (val === null || val === undefined) return `${field}=NULL`; // NULL values
                    return `${field}=N'${val}'`; // String & Number -> 'Value'
                });
                if (idItem != 0) {
                    return `EDITOK*** ${valuesSQL.join(", ")} WHERE ID=${idItem}`;
                }
                return `ADDNEWOK*** ${fields.join(", ")}) VALUESOK***${valuesSQL.map(v => v.split("=")[1]).join(", ")})`;
            };
            const sqlQuery = formatSQLInsert(values);
            const response = await Api.post(
                `${import.meta.env.VITE_API_URL}/danhmuc/SaveAddOrEditDanhMuc`,
                null,
                {
                    params: {
                        tbl: "DANHMUCTENDONVI",
                        sqltxt: sqlQuery,
                        masoOld: maOld.current,
                        masoNew: maNew.current
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
                (reloadGrid || (() => { }))();
            } else {
                showNotification('', 'Đã xảy ra lỗi trong quá trình thực thi', 'danger')
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    };
    const handleAddMore = (resetForm: () => void) => {
        resetForm();
        setInitialValues(defaultValue)
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
                                <FormGroup id="txtDIENTHOAI" label="Điện thoại" isColForLabel labelClassName="col-md-5 text-capitalize" childWrapperClassName="col-md-7 pe-2">
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
                                value={values.cboTENQUANLY} // Đã đảm bảo là string
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
                                    getListKhuVuc(e.target.value);
                                }}
                            >
                                <option value="">-- Chọn nhóm khu vực --</option>
                                <option>Miền Bắc</option>
                                <option>Miền Nam</option>
                            </Select>
                        </FormGroup>
                    </div>
                    <div className="col-md-5">
                        <FormGroup id="cboTENKHUVUC" label="Khu vực" isColForLabel labelClassName="col-md-3 text-capitalize" childWrapperClassName="col-md-9">
                            <Select
                                ariaLabel="Khu vực"
                                name="cboTENKHUVUC"
                                value={values.cboTENKHUVUC} // Đã đảm bảo là string
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setFieldValue("cboTENKHUVUC", e.target.value);
                                }}
                            >
                                <option value="">-- Chọn khu vực --</option>
                                {listKhuVuc.map((loai, index) => (
                                    <option key={index} value={loai}>
                                        {loai}
                                    </option>
                                ))}
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
                                <div className="d-flex justify-content-between">
                                    <div className="col-0 col-md-4"></div>
                                    <div className="col-4">
                                        <Checks
                                            type="checkbox"
                                            id="chkNHANVIEN"
                                            label="Là nhân viên"
                                            name="chkNHANVIEN"
                                            onChange={handleChange}
                                            checked={values.chkNHANVIEN}
                                        />
                                    </div>
                                    <div className="col-4">
                                        <Checks
                                            type="checkbox"
                                            id="chkTHEODOIHOADON"
                                            label="Theo đối tượng"
                                            name="chkTHEODOIHOADON"
                                            onChange={handleChange}
                                            checked={values.chkTHEODOIHOADON}
                                        />
                                    </div>
                                </div>



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
                            onClick={() => setOpenModal(false)}>
                            Đóng
                        </Button>
                    </div>


                </Form>
            )}
        </Formik>
    );
};
export default DanhMucDoiTuongForm