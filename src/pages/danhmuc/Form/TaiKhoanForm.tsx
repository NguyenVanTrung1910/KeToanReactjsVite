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
interface TaiKhoanFormProps {
    idItem: number, url?: string, setOpenModal: (status: boolean) => void;
    reloadGrid?:()=>void;

}

const TaiKhoanForm: React.FC<TaiKhoanFormProps> = ({ idItem, url, setOpenModal,reloadGrid }) => {
    const [listLoaiTaiKhoan, setListLoaiTaiKhoan] = useState<string[]>([]);
    const defaultValue = {
        txtShtk: "",
        txtTenTaiKhoan: "",
        numCapTK: '',
        txtLoaiTaiKhoan: "",
        txtGhiChu: "",
        chkBATBUOC: false,
        chkCHITIET: false,
        chkVATTU: false,
        chkHOPDONG: false,
        chkKHOANMUC: false,
        chkHDSXKD: false,
        chkSODU2BEN: false,
        chkGIATHANH: false,
        chkCONGTRINH: false,
        chkPHONGBAN: false,
        chkHIENCCDC: false,
        chkCONGCU: false,
    }
    const [initialValues, setInitialValues] = useState(defaultValue);
    const maOld = useRef(111);
    const maNew = useRef(0);
    useEffect(() => {
        const getLoaiTaiKhoan = async () => {
            const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetLoaiTaiKhoan`);
            if (true) {
                const loaiTaiKhoanList = response.data.data.map((item: any) => item.LOAITAIKHOAN);
                setListLoaiTaiKhoan(loaiTaiKhoanList);
            }
        }
        if (idItem !== 0) {
            const fetchData = async () => {
                try {
                    const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetDoiTuongForEdit`, {
                        params: {
                            TenBang: "DANHMUCTAIKHOAN",
                            MaSo: "SHTK",
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
        getLoaiTaiKhoan();
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
                        tbl: "DANHMUCTAIKHOAN",
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
console.log("tk form")
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values, handleChange, resetForm }) => (
                <Form className="row g-4 w-100">
                    <div className="col-12">
                        <FastField name="txtShtk">
                            {({ field }: any) => (
                                <FormGroup id="txtShtk" label="SHTK" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} required />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FastField name="txtTenTaiKhoan">
                            {({ field }: any) => (
                                <FormGroup id="txtTenTaiKhoan" label="Tên tài khoản" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FormGroup id="numCapTK" label="Cấp tài khoản" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                            <Select
                                ariaLabel="Chọn cấp tài khoản"
                                name="numCapTK"
                                value={values.numCapTK} // Đã đảm bảo là string
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setFieldValue("numCapTK", e.target.value);
                                }}
                            >
                                <option value="">-- Chọn cấp tài khoản --</option>
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
                            label="Quyền hạn"
                            labelClassName="col-sm-3 text-capitalize"
                            isColForLabel

                            childWrapperClassName="col-sm-9"
                        >
                            <div className="d-flex justify-content-between">
                                <div className="col-6">
                                    <ChecksGroup>
                                        <Checks
                                            type="checkbox"
                                            id="chkBATBUOC"
                                            label=" Sử dụng hạch toán"
                                            name="chkBATBUOC"
                                            onChange={handleChange}
                                            checked={values.chkBATBUOC}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkCHITIET"
                                            label="Theo đối tượng"
                                            name="chkCHITIET"
                                            onChange={handleChange}
                                            checked={values.chkCHITIET}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkVATTU"
                                            label="Theo vật tư"
                                            name="chkVATTU"
                                            onChange={handleChange}
                                            checked={values.chkVATTU}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkHOPDONG"
                                            label="Theo hợp đồng kinh tế"
                                            name="chkHOPDONG"
                                            onChange={handleChange}
                                            checked={values.chkHOPDONG}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkKHOANMUC"
                                            label="Theo khoản mục"
                                            name="chkKHOANMUC"
                                            onChange={handleChange}
                                            checked={values.chkKHOANMUC}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkHDSXKD"
                                            label="Theo hoạt động SXKD"
                                            name="chkHDSXKD"
                                            onChange={handleChange}
                                            checked={values.chkHDSXKD}
                                        />
                                    </ChecksGroup>
                                </div>
                                <div className="col-6">
                                    <ChecksGroup>
                                        <Checks
                                            type="checkbox"
                                            id="chkSODU2BEN"
                                            label="Số dư để 2 vế Nợ, Có"
                                            name="chkSODU2BEN"
                                            onChange={handleChange}
                                            checked={values.chkSODU2BEN}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkGIATHANH"
                                            label="Theo sản phẩm"
                                            name="chkGIATHANH"
                                            onChange={handleChange}
                                            checked={values.chkGIATHANH}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkCONGTRINH"
                                            label="Theo công trình"
                                            name="chkCONGTRINH"
                                            onChange={handleChange}
                                            checked={values.chkCONGTRINH}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkPHONGBAN"
                                            label="Theo bộ phận, phòng ban"
                                            name="chkPHONGBAN"
                                            onChange={handleChange}
                                            checked={values.chkPHONGBAN}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkHIENCCDC"
                                            label="Theo CCDC, TSCĐ"
                                            name="chkHIENCCDC"
                                            onChange={handleChange}
                                            checked={values.chkHIENCCDC}
                                        />
                                        <Checks
                                            type="checkbox"
                                            id="chkCONGCU"
                                            label="Hiện bảng kê phân bổ CCDC, TSCĐ"
                                            name="chkCONGCU"
                                            onChange={handleChange}
                                            checked={values.chkCONGCU}
                                        />
                                    </ChecksGroup>
                                </div>
                            </div>


                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            id="txtLoaiTaiKhoan"
                            label="Loại tài khoản"
                            isColForLabel
                            labelClassName="col-sm-3 text-capitalize"
                            childWrapperClassName="col-sm-9"
                        >
                            <Select
                                ariaLabel="Chọn loại tài khoản"
                                name="txtLoaiTaiKhoan"
                                value={values.txtLoaiTaiKhoan}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setFieldValue("txtLoaiTaiKhoan", e.target.value);
                                }}
                            >
                                <option value="">-- Chọn loại tài khoản --</option>
                                {listLoaiTaiKhoan.map((loai, index) => (
                                    <option key={index} value={loai}>
                                        {loai}
                                    </option>
                                ))}
                            </Select>
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FastField name="txtGhiChu">
                            {({ field }: any) => (
                                <FormGroup id="txtGhiChu" label="Ghi chú" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Textarea
                                        placeholder=''
                                        aria-label='.form-control-lg example'
                                        {...field}

                                    />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12 d-flex justify-content-end gap-2 mt-4">
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
                            onClick={() => setOpenModal(false)}
                        >
                            Đóng
                        </Button>
                    </div>


                </Form>
            )}
        </Formik>
    );
};
export default TaiKhoanForm