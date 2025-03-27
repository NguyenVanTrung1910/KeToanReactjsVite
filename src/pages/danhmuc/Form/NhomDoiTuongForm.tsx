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
interface NhomDoiTuongFormProps {
    idItem: number, url?: string, setOpenModal: (status: boolean) => void;

}

const NhomDoiTuongForm: React.FC<NhomDoiTuongFormProps> = ({ idItem, url, setOpenModal }) => {
    const [listLoaiTaiKhoan, setListLoaiTaiKhoan] = useState<string[]>([]);
    const defaultValue = {
        txtMaNhom: "",
        txtTenNhom: "",
        txtSHTKOK: "",
        chkAUTOMA: false,
        txtKYHIEU: '',
        txtGhiChu: '',
    }
    const [initialValues, setInitialValues] = useState(defaultValue);
    const maOld = useRef(1);
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
                            TenBang: "DANHMUCNHOMDONVI",
                            MaSo: "MANHOM",
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
                        tbl: "DANHMUCNHOMDONVI",
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
                        <FastField name="txtMaNhom">
                            {({ field }: any) => (
                                <FormGroup id="txtMaNhom" label="Mã nhóm" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} required />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FastField name="txtTenNhom">
                            {({ field }: any) => (
                                <FormGroup id="txtTenNhom" label="Tên nhóm" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FastField name="txtSHTKOK">
                            {({ field }: any) => (
                                <FormGroup id="txtSHTKOK" label="Tài khoản liên quan" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Textarea
                                        placeholder=''
                                        aria-label='.form-control-lg example'
                                        {...field}

                                    />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            id="exampleSelectTwoWay"
                            label="  "
                            labelClassName="col-sm-3 text-capitalize"
                            isColForLabel
                            childWrapperClassName="col-sm-9"
                        >

                            <Checks
                                type="checkbox"
                                id="chkAUTOMA"
                                label=" Tự động tăng Mã đối tượng"
                                name="chkAUTOMA"
                                onChange={handleChange}
                                checked={values.chkAUTOMA}
                            />



                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FastField name="txtKYHIEU">
                            {({ field }: any) => (
                                <FormGroup id="txtKYHIEU" label="Ký tự mã" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} />

                                </FormGroup>
                            )}
                        </FastField>
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
export default NhomDoiTuongForm