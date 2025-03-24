import React, { useEffect, useRef, useState } from "react";
import api from "../../Api/api";
import DataTable from "./DataTable";

interface TitleColTable {
  TENTRUONG: string;
  TENCOT?: string;
  KIEUDULIEU?: string;
  LOOKUPURL?: string;
  RULES?: string;
}

interface GetDataProps {
  apiUrlForAll: string;
  apiUrlGetTitle: string;
  loai: string;
}

const DataGrid: React.FC<GetDataProps> = ({ apiUrlForAll, apiUrlGetTitle, loai }) => {
  const columnsRef = useRef<TitleColTable[]>([]); // Dùng useRef để lưu cột
  const [isLoaded, setIsLoaded] = useState(false); // Trạng thái tải dữ liệu xong

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<TitleColTable[]>(apiUrlGetTitle);
        columnsRef.current = response.data; // Lưu dữ liệu vào ref (không gây re-render)
        setIsLoaded(true); // Đánh dấu là đã tải xong
      } catch (error) {
        setIsLoaded(true); // Đánh dấu là đã tải xong ngay cả khi lỗi
      }
    };

    fetchData();
  }, []);

  return isLoaded ? (
    <DataTable url={apiUrlForAll} keyField="ID" columns={columnsRef.current} pageSize={10} loai={loai} />
  ) : (
    <h2></h2>
  );
};

export default DataGrid;
