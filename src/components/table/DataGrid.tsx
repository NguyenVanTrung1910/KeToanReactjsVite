import React, { useEffect, useRef, useState } from "react";
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

// const DataGrid: React.FC<GetDataProps> = ({ apiUrlForAll, apiUrlGetTitle, loai, getContentModal }) => {
//   const columnsRef = useRef<TitleColTable[]>([]); // Dùng useRef để lưu cột
//   const [isLoaded, setIsLoaded] = useState(false); // Trạng thái tải dữ liệu xong

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await api.get<TitleColTable[]>(apiUrlGetTitle);
//         columnsRef.current = response.data; // Lưu dữ liệu vào ref (không gây re-render)
//         setIsLoaded(true); // Đánh dấu là đã tải xong
//       } catch (error) {
//         setIsLoaded(true); // Đánh dấu là đã tải xong ngay cả khi lỗi
//       }
//     };

//     fetchData();
//   }, []);
//   console.log('datagrid')
//   return isLoaded ? (
//     <div className="card card-stretch-full">
//       <DataTable url={apiUrlForAll} keyField="ID" columns={columnsRef.current} pageSize={10} loai={loai} getContentModal={getContentModal}/>
//     </div>
//   ) : (
//     <h2></h2>
//   );
// };
const DataGrid: React.FC<GetDataProps> = ({ apiUrlForAll, apiUrlGetTitle, loai, getContentModal }) => {
  const [columns, setColumns] = useState<TitleColTable[]>([]); // Lưu cột trong state
  const [isLoaded, setIsLoaded] = useState(false); // Trạng thái tải dữ liệu xong
  console.log('datagrid')
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

  console.log('datagrid');

  return isLoaded ? (
    <div className="card card-stretch-full">
      <DataTable url={apiUrlForAll} keyField="ID" columns={columns} pageSize={10} loai={loai} getContentModal={getContentModal} />
    </div>
  ) : (
    <h2>Loading...</h2>
  );
};

export default DataGrid;
