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
  // getContentModal: (idItem: number, url: string) => JSX.Element;
  setOpenModal: (status:boolean)=>void;
  idItemCurrent: React.MutableRefObject<number>;
}

const DataGrid: React.FC<GetDataProps> = ({ apiUrlForAll, apiUrlGetTitle, loai,idItemCurrent,setOpenModal }) => {
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
      <DataTable url={apiUrlForAll} keyField="ID" columns={columns} pageSize={10} loai={loai} idItemCurrent={idItemCurrent} setOpenModal={setOpenModal}/>
    </div>
  ) : (
    <h2>Loading...</h2>
  );
};

export default DataGrid;
