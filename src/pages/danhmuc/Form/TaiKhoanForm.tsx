import { useEffect, useRef, useState } from "react";
import Api from "../../../Api/api";
import { FastField, Form, Formik } from "formik";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Select from "../../../components/bootstrap/forms/Select";
import Checks, { ChecksGroup } from "../../../components/bootstrap/forms/Checks";
import Textarea from "../../../components/bootstrap/forms/Textarea";
import Button from "../../../components/bootstrap/Button";
import useDanhMucForm from "../../../hooks/useDanhMucForm";

interface TaiKhoanFormProps {
    idItem: number, url?: string, setOpenModal: (status: boolean) => void;
    reloadGrid?: () => void;
}
const TaiKhoanForm: React.FC<TaiKhoanFormProps> = ({ idItem, url, setOpenModal, reloadGrid }) => {
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
    const { initialValues, kiemTraMa, handleSubmit,handleAddMore } = useDanhMucForm("DANHMUCTAIKHOAN",defaultValue, "SHTK", idItem, reloadGrid);
    const getLoaiTaiKhoan = async () => {
        const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetLoaiTaiKhoan`);
        if (true) {
            const loaiTaiKhoanList = response.data.data.map((item: any) => item.LOAITAIKHOAN);
            setListLoaiTaiKhoan(loaiTaiKhoanList);
        }
    }
    useEffect(()=>{
        getLoaiTaiKhoan()
    },[idItem])
    
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
                                    <Input type="text" {...field} required
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setFieldValue("txtShtk", e.target.value);
                                            kiemTraMa(e.target.value);
                                        }} />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FastField name="txtTenTaiKhoan">
                            {({ field }: any) => (
                                <FormGroup id="txtTenTaiKhoan" label="Tên tài khoản" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} required />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FormGroup id="numCapTK" label="Cấp tài khoản" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                            <Select
                                ariaLabel="Chọn cấp tài khoản"
                                name="numCapTK"
                                required
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