import api from "../../Api/api";
import React, { useEffect, useState } from 'react';
import DataTable from "../../components/table/DataTable";

interface TitleColTable {
    TENTRUONG: string; TENCOT?: string; KIEUDULIEU?: string; LOOKUPURL?: string;RULES?: string
}
interface GetDataProps {
    apiUrlForAll: string;
    apiUrlGetTitle: string;
    loai: string;
  }
const GetDataForTable: React.FC<GetDataProps> =  ({apiUrlForAll,apiUrlGetTitle,loai}) => {
    async function GetTitle(): Promise< TitleColTable[]> {
        try {
          const response = await api.get<TitleColTable[]>(apiUrlGetTitle);
          return response.data;
        } catch (error) {
          return [];
        }
      }
      const [columnss, setColumns] = useState<TitleColTable[]>([]);

      useEffect(() => {
        const fetchData = async () => {
            const data = await GetTitle();
            setColumns(data);
        };
    
        fetchData();
    }, []);
    return <DataTable url={apiUrlForAll} keyField="ID" columns={columnss} pageSize={10} loai={loai}/>;
};
export default GetDataForTable;