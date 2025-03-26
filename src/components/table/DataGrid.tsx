import React, { forwardRef, useEffect, useRef, useState } from "react";
import api from "../../Api/api";
import DataTable from "./DataTable";
import { Value } from "devextreme-react/range-selector";

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
  getContentModal: (idItem: number, url: string) => JSX.Element;
}

const DataGrid: React.FC<GetDataProps> = ({ apiUrlForAll, apiUrlGetTitle, loai, getContentModal }) => {
  const [columns, setColumns] = useState<TitleColTable[]>([]); // Lưu cột trong state
  const [isLoaded, setIsLoaded] = useState(false); // Trạng thái tải dữ liệu xong
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<TitleColTable[]>(apiUrlGetTitle);
        
        // Chỉ cập nhật nếu dữ liệu thay đổi
        if (JSON.stringify(columns) !== JSON.stringify(response.data)) {
          setColumns(response.data);
        }
        
        setIsLoaded(true);
      } catch (error) {
        setIsLoaded(true);
      }
    };

    fetchData();
  }, [apiUrlGetTitle]); // Gọi lại khi apiUrlGetTitle thay đổi
  return isLoaded ? (
    <div className="card card-stretch-full">
      <DataTable url={apiUrlForAll} keyField="ID" columns={columns} pageSize={10} loai={loai} getContentModal={getContentModal} />
    </div>
  ) : (
    <h2>Loading...</h2>
  );
};

export default DataGrid;
