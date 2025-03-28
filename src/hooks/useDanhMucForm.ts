import { useState, useEffect, useRef } from "react";
import api from "../Api/api"; // Đường dẫn API có thể thay đổi
import showNotification from "../components/extras/showNotification";

const useDanhMucForm = (tenBang: string,defaultValue:Record<string, any>, tenMa: string, idItem: number, reloadGrid?: () => void) => {
    const [initialValues, setInitialValues] = useState<Record<string, any>>(defaultValue);
    const maOld = useRef<string>("1");
    const maNew = useRef<string>("1");

    // ✅ Hàm kiểm tra mã
    const kiemTraMa = async (inputValue: string) => {
        try {
            const response = await api.post(`${import.meta.env.VITE_API_URL}/danhmuc/KiemTraMa`, null, {
                params: {
                    TenBang: tenBang,
                    MaSo: tenMa,
                    ma: inputValue,
                    dieukien: "KhongCo"
                }
            });
            if (response.data) {
                const message = response.data.message;
                if (message === "UNICODE") showNotification("", "Không đúng định dạng mã!!", "warning");
                else if (message === "OK") showNotification("", "Mã đã tồn tại!!", "warning");
            }
        } catch (error) {
            console.error("Lỗi kiểm tra mã:", error);
        }
    };

    // ✅ Fetch dữ liệu khi chỉnh sửa
    const getDoiTuong = async () => {
        try {
            const response = await api.get(`${import.meta.env.VITE_API_URL}/danhmuc/GetDoiTuongForEdit`, {
                params: {
                    TenBang: tenBang,
                    MaSo: tenMa,
                    iddoituong: idItem.toString(),
                    madoituong: maOld.current
                }
            });
            if (response.data && response.data.data.length > 0) {
                const apiData = response.data.data[0];

                if (apiData) {
                    const formattedData = Object.keys(initialValues).reduce((acc, key) => {
                        const newKey = key.substring(3).toUpperCase();
                        return {
                            ...acc,
                            [key]: apiData[newKey] ?? initialValues[key as keyof typeof initialValues],
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

    // ✅ Xử lý Submit Form
    const handleSubmit = async (values: any) => {
        try {
            const formatSQLInsert = (values: any) => {
                const formattedValues = Object.entries(values).reduce((acc, [key, value]) => {
                    const newKey = key.substring(3);
                    acc[newKey] = value;
                    return acc;
                }, {} as Record<string, any>);

                const fields = Object.keys(formattedValues);
                const valuesSQL = fields.map((field) => {
                    const val = formattedValues[field];
                    if (typeof val === "boolean") return `${field}=${val ? 1 : 0}`;
                    if (val === null || val === undefined) return `${field}=NULL`;
                    return `${field}=N'${val}'`;
                });

                return idItem !== 0
                    ? `EDITOK*** ${valuesSQL.join(", ")} WHERE ID=${idItem}`
                    : `ADDNEWOK*** ${fields.join(", ")}) VALUESOK***${valuesSQL.map((v) => v.split("=")[1]).join(", ")})`;
            };

            const sqlQuery = formatSQLInsert(values);
            const response = await api.post(
                `${import.meta.env.VITE_API_URL}/danhmuc/SaveAddOrEditDanhMuc`,
                null,
                {
                    params: {
                        tbl: tenBang,
                        sqltxt: sqlQuery,
                        masoOld: maOld.current,
                        masoNew: maNew.current
                    }
                }
            );

            if (response.status === 200) {
                if (!response.data.success) {
                    showNotification("", response.data.message, "warning");
                } else {
                    showNotification("", idItem > 0 ? "Sửa thành công" : "Thêm thành công", "success");
                }
                reloadGrid?.();
            } else {
                showNotification("", "Đã xảy ra lỗi trong quá trình thực thi", "danger");
            }
        } catch (error) {
            console.error("Lỗi khi gửi dữ liệu:", error);
        }
    };
    const handleAddMore = (resetForm: () => void) => {
        resetForm();
        setInitialValues(defaultValue);
    };
    // ✅ useEffect để fetch data khi `idItem` thay đổi
    useEffect(() => {
        if (idItem !== 0) {
            getDoiTuong();
        }
    }, [idItem]);

    return { initialValues, kiemTraMa, handleSubmit,handleAddMore };
};

export default useDanhMucForm;
