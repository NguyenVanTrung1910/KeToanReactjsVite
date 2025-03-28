import { useEffect, useRef, useState } from "react";
import Api from "../../../Api/api";
import { FastField, Form, Formik } from "formik";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Textarea from "../../../components/bootstrap/forms/Textarea";
import Button from "../../../components/bootstrap/Button";
import useDanhMucForm from "../../../hooks/useDanhMucForm";
import Select from "../../../components/bootstrap/forms/Select";
interface NhomDoiTuongFormProps {
    idItem: number, url?: string, setOpenModal: (status: boolean) => void;
    reloadGrid?: () => void;

}

const DanhMucKhuVucForm: React.FC<NhomDoiTuongFormProps> = ({ idItem, url, setOpenModal, reloadGrid }) => {
    const defaultValue = {
        cboTENNHOMKHUVUC:"",
        txtMaKhuVuc: "",
        txtTenKhuVuc: "",
        txtGhiChu: '',
    }
    const { initialValues, kiemTraMa, handleSubmit, handleAddMore } = useDanhMucForm("DANHMUCKHUVUC", defaultValue, "MAKHUVUC", idItem, reloadGrid);
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values, handleChange, resetForm }) => (
                <Form className="row g-4 w-100">
                                        <div className="col-md-7">
                        <FormGroup id="cboTENNHOMKHUVUC" label="Nhóm khu vực" isColForLabel labelClassName="col-md-5 text-capitalize" childWrapperClassName="col-md-7">
                            <Select

                                ariaLabel="Nhóm khu vực"
                                name="cboTENNHOMKHUVUC"
                                value={values.cboTENNHOMKHUVUC} // Đã đảm bảo là string
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setFieldValue("cboTENNHOMKHUVUC", e.target.value);
                                }}
                            >
                                <option value="">-- Chọn nhóm khu vực --</option>
                                <option>Miền Bắc</option>
                                <option>Miền Nam</option>
                            </Select>
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FastField name="txtMaKhuVuc">
                            {({ field }: any) => (
                                <FormGroup id="txtMaKhuVuc" label="Mã khu vực" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} required
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setFieldValue("txtMaKhuVuc", e.target.value);
                                            kiemTraMa(e.target.value);
                                        }}
                                    />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FastField name="txtTenKhuVuc">
                            {({ field }: any) => (
                                <FormGroup id="txtTenKhuVuc" label="Tên khu vực" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} required />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FastField name="txtGhiChu">
                            {({ field }: any) => (
                                <FormGroup id="txtGhiChu" label="Ghi Chú" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
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
export default DanhMucKhuVucForm