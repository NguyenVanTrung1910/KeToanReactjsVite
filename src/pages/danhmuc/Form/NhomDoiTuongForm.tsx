import { useEffect, useRef, useState } from "react";
import { FastField, Form, Formik } from "formik";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Checks, { ChecksGroup } from "../../../components/bootstrap/forms/Checks";
import Textarea from "../../../components/bootstrap/forms/Textarea";
import Button from "../../../components/bootstrap/Button";
import useDanhMucForm from "../../../hooks/useDanhMucForm";
interface NhomDoiTuongFormProps {
    idItem: number, url?: string, setOpenModal: (status: boolean) => void;
    reloadGrid?: () => void;

}

const NhomDoiTuongForm: React.FC<NhomDoiTuongFormProps> = ({ idItem, url, setOpenModal, reloadGrid }) => {
    const [listLoaiTaiKhoan, setListLoaiTaiKhoan] = useState<string[]>([]);
    const defaultValue = {
        txtMaNhom: "",
        txtTenNhom: "",
        txtSHTKOK: "",
        chkAUTOMA: false,
        txtKYHIEU: '',
        txtGhiChu: '',
    }
    const { initialValues, kiemTraMa, handleSubmit, handleAddMore } = useDanhMucForm("DANHMUCNHOMDONVI", defaultValue, "MANHOM", idItem, reloadGrid);
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
                                    <Input type="text" {...field} required
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setFieldValue("txtMaNhom", e.target.value);
                                            kiemTraMa(e.target.value);
                                        }}
                                    />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FastField name="txtTenNhom">
                            {({ field }: any) => (
                                <FormGroup id="txtTenNhom" label="Tên nhóm" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} required />
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