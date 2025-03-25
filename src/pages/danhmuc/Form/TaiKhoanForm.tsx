import { useEffect, useState } from "react";
import Api from "../../../Api/api";
import { FastField, Form, Formik } from "formik";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Select from "../../../components/bootstrap/forms/Select";
import Checks, { ChecksGroup } from "../../../components/bootstrap/forms/Checks";
import Textarea from "../../../components/bootstrap/forms/Textarea";

const TaiKhoanForm = (idItem: number, url?: string) => {
    const [listLoaiTaiKhoan, setListLoaiTaiKhoan] = useState<string[]>([]);
    const [initialValues, setInitialValues] = useState({
        shtk: "",
        tenTaiKhoan: "",
        capTaiKhoan: '',
        loaiTaiKhoan: "",
        ghiChu: "",
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
    });
    useEffect(() => {
        // const getLoaiTaiKhoan = async () => {
        //     const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetLoaiTaiKhoan`);
        //     if (true) {
        //         const loaiTaiKhoanList = response.data.map((item: any) => item.LOAITAIKHOAN);
        //         setListLoaiTaiKhoan(loaiTaiKhoanList);
        //     }
        // }

        if (idItem !== 0) {
            const fetchData = async () => {
                try {
                    const response = await Api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetDoiTuongForEdit`, {
                        params: {
                            TenBang: "DANHMUCTAIKHOAN",
                            MaSo: "SHTK",
                            iddoituong: idItem.toString(),
                            madoituong: ""
                        }
                    });

                    if (response.data && response.data.data.length > 0) {
                        const apiData = response.data.data[0]; // Lấy object đầu tiên từ mảng data
                        const validCapTaiKhoan = [1, 2, 3, 4, 5, 6, 7].includes(apiData.CAPTK)
                            ? apiData.CAPTK.toString()
                            : "1";
                        setInitialValues({
                            shtk: apiData.SHTK || "",
                            tenTaiKhoan: apiData.TENTAIKHOAN || "",
                            capTaiKhoan: validCapTaiKhoan,
                            loaiTaiKhoan: apiData.LOAITAIKHOAN || "",
                            ghiChu: apiData.GHICHU || "",
                            chkBATBUOC: apiData.BATBUOC || false,
                            chkCHITIET: apiData.CHITIET || false,
                            chkVATTU: apiData.VATTU || false,
                            chkHOPDONG: apiData.HOPDONG || false,
                            chkKHOANMUC: apiData.KHOANMUC || false,
                            chkHDSXKD: apiData.HDSXKD || false,
                            chkSODU2BEN: apiData.SODU2BEN || false,
                            chkGIATHANH: apiData.GIATHANH || false,
                            chkCONGTRINH: apiData.CONGTRINH || false,
                            chkPHONGBAN: apiData.PHONGBAN || false,
                            chkHIENCCDC: apiData.HIENCCDC || false,
                            chkCONGCU: apiData.CONGCU || false,
                        });
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy dữ liệu:", error);
                }
            console.log(12003213)
            };
            fetchData(); // Gọi hàm async
        }
        // console.log(123232323)
        // getLoaiTaiKhoan();
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

            console.log(response.data)


        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    };
    console.log('ádjsakdj')
    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            {({ setFieldValue, values, handleChange }) => (
                <Form className="row g-4 w-100">
                    <div className="col-12">
                        <FastField name="shtk">
                            {({ field }: any) => (
                                <FormGroup id="shtk" label="SHTK" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FastField name="tenTaiKhoan">
                            {({ field }: any) => (
                                <FormGroup id="tenTaiKhoan" label="Tên tài khoản" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                                    <Input type="text" {...field} />
                                </FormGroup>
                            )}
                        </FastField>
                    </div>
                    <div className="col-12">
                        <FormGroup id="capTaiKhoan" label="Cấp tài khoản" isColForLabel labelClassName="col-sm-3 text-capitalize" childWrapperClassName="col-sm-9">
                            <Select
                                ariaLabel="Chọn cấp tài khoản"
                                name="capTaiKhoan"
                                value={values.capTaiKhoan} // Đã đảm bảo là string
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setFieldValue("capTaiKhoan", e.target.value);
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
                            childWrapperClassName="col-sm-9">
                            <ChecksGroup isInline>
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
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            id="loaiTaiKhoan"
                            label="Loại tài khoản"
                            isColForLabel
                            labelClassName="col-sm-3 text-capitalize"
                            childWrapperClassName="col-sm-9"
                        >
                            <Select
                                ariaLabel="Chọn loại tài khoản"
                                name="loaiTaiKhoan"
                                value={values.loaiTaiKhoan}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                    setFieldValue("loaiTaiKhoan", e.target.value);
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
                    <div className="col-12">
                        <button type="submit" className="btn btn-primary">
                            Gửi dữ liệu
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
    );
};
export default TaiKhoanForm