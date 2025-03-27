import React, { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import 'devextreme/data/odata/store';
import {
  Column,
  DataGrid,
  FilterRow,
  HeaderFilter,
  GroupPanel,
  Scrolling,
  Editing,
  Grouping,
  Paging,
  Pager,
  Item,
} from "devextreme-react/data-grid";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DataType } from "devextreme/ui/data_grid";
import api from "../../Api/api";
import showNotification from "../extras/showNotification";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Toolbar } from "devextreme-react";
interface CustomDataGridProps {
  url: string;
  apiUrlGetTitle: string;
  keyField: string;
  pageSize?: number;
  displayCol?: string[];
  loai: string;
  setIsOpenModal:(status:boolean)=>void;
  idItemCurrent:React.MutableRefObject<number>;
}
export interface FunctionRef {
  exportToExcel: () => void; // Expose function này ra ngoài cho component cha gọi
  reloadGrid:()=>void;
}
interface TitleColTable {
  TENTRUONG: string; TENCOT?: string; KIEUDULIEU?: string; LOOKUPURL?: string; FORMAT?: string, HIENTHI?: number,
}
const DataTable = React.memo(forwardRef<FunctionRef, CustomDataGridProps>(
  ({ url, apiUrlGetTitle, keyField, pageSize = 100, displayCol, loai, setIsOpenModal, idItemCurrent }, ref) => {
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const gridRef = useRef<DataGrid>(null);
    const [filteredColumns, setFilteredColumns] = useState<JSX.Element[]>([]);
    const idCurrent = useRef(0);
    useImperativeHandle(ref, () => ({
      exportToExcel,
      reloadGrid,
    }));
    const dataSource = useMemo(() => {
      return createStore({
        key: keyField,
        loadUrl: `${url}/GetDataForTable?loai=${loai}`,
        insertUrl: `${url}/InsertOrder`,
        updateUrl: `${url}/UpdateOrder`,
        deleteUrl: `${url}/DeleteOrder`,
        onBeforeSend: (method, ajaxOptions) => {
          ajaxOptions.xhrFields = { withCredentials: true };
        },
      });
    }, [url, loai]);

    const handleEditClick = (e: any) => {
      idItemCurrent.current = e.row.data.ID;
      setIsOpenModal(true);
    };
    const reloadGrid = () => {
      if (gridRef.current) {
        const dataSource = gridRef.current.instance.getDataSource();
        if (dataSource) {
          dataSource.reload();
          dataSource.load();
        }
      }
    };
    const handleOpenModal = (e: any) => {
      idCurrent.current = e.row.data.ID;
      setOpenDeleteModal(true);
    };
    const handleDeleteClick = () => {
      const deleteData = async () => {
        try {
          const response = await api.delete(`${url}/XoaDong`, {
            params: {
              TenBang: loai,
              IDcmd: idCurrent.current
            }
          });

          if (response.status === 200) {
            if (response.data.success === false) {
              showNotification('', response.data.message, 'warning')

            } else {
              showNotification('', response.data.message, 'success')
              reloadGrid()

            }
          } else {
            showNotification('', 'Đã xảy ra lỗi trong quá trình xóa', 'danger')
          }
        } catch (error) {
          showNotification('', 'Đã xảy ra lỗi trong quá trình xóa', 'danger')
        }
      };
      deleteData()
      setOpenDeleteModal(false)
    };
    useEffect(() => {
      const fetchColumns = async () => {
        try {
          const response = await api.get<TitleColTable[]>(apiUrlGetTitle);

          // ✅ Xử lý dữ liệu đúng kiểu `JSX.Element[]`
          const columns: JSX.Element[] = response.data
            .filter((col) => !displayCol || displayCol.includes(col.TENTRUONG)) // Lọc cột hiển thị
            .map((col) => {
              console.log("Change Column", col.TENTRUONG);

              if (col.HIENTHI === 0) return null; // Bỏ qua cột không hiển thị

              if (col.TENTRUONG === "SUAXOA") {
                return (
                  <Column
                    key="SUAXOA"
                    type="buttons"
                    width={90}
                    caption="Sửa-Xóa"
                    alignment="left"
                    buttons={[
                      { hint: "Sửa", icon: "edit", onClick: handleEditClick },
                      { hint: "Xóa", icon: "trash", onClick: handleOpenModal },
                    ]}
                  />
                );
              }

              return (
                <Column
                  key={col.TENTRUONG}
                  dataField={col.TENTRUONG}
                  caption={col.TENCOT}
                  dataType={col.KIEUDULIEU as DataType}
                  alignment={
                    col.KIEUDULIEU === "number"
                      ? "left"
                      : col.KIEUDULIEU === "bool"
                        ? "center"
                        : undefined
                  }
                  format={col.FORMAT}
                  cellRender={(cellData) =>
                    col.KIEUDULIEU === "bool" ? (
                      cellData.value ? (
                        <span style={{ fontSize: "16px" }}>✓</span>
                      ) : (
                        <span></span>
                      )
                    ) : (
                      <span>{cellData.value}</span>
                    )
                  }
                />
              );
            })
            .filter(Boolean) as JSX.Element[]; // ✅ Cast về kiểu `JSX.Element[]`

          setFilteredColumns(columns);
        } catch (error) {
          console.error("Lỗi khi lấy danh sách cột:", error);
        }
      };

      fetchColumns();
    }, [apiUrlGetTitle]);
    const exportToExcel = () => {
      if (!gridRef.current) {
        console.error("Chưa có dữ liệu!");
        return;
      }

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet("Sheet 1");

      // ✨ Thêm tiêu đề bảng vào dòng đầu tiên
      const titleRow = worksheet.addRow([loai]);
      titleRow.font = { bold: true, size: 14 }; // Làm đậm, cỡ chữ lớn
      titleRow.alignment = { horizontal: "center" }; // Căn giữa

      // ✨ Hợp nhất ô tiêu đề bảng từ A1 đến cột cuối cùng
      const columnCount = gridRef.current.instance.columnCount();
      worksheet.mergeCells(`A1:${String.fromCharCode(64 + columnCount)}1`);

      // ✨ Đẩy dữ liệu DataGrid xuống từ dòng thứ 2
      exportDataGrid({
        component: gridRef.current.instance,
        worksheet,
        autoFilterEnabled: true,
        topLeftCell: { row: 2, column: 1 }, // Bắt đầu từ dòng thứ 2, cột 1
      }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer) => {
          saveAs(new Blob([buffer], { type: "application/octet-stream" }), `${loai}-${Math.random()}.xlsx`);
        });
      });
    };
console.log('datatable')

    return (
      <>
        <DataGrid dataSource={dataSource} ref={gridRef} showBorders height={600} remoteOperations={true} columnAutoWidth={true}  // Đặt cột tự động căn chỉnh độ rộng
          // columnMinWidth={90}
          groupPanel={{
            visible: true,
            emptyPanelText: "Nhóm dữ liệu bằng cách kéo cột vào đây!"
          }}

        >
          <Paging enabled={true} defaultPageSize={pageSize} />
          <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20, 100]} showInfo={true} />
          <Column
            caption="STT"
            width={70}
            cellRender={(data) => <span>{data.component.pageIndex() * data.component.pageSize() + data.rowIndex + 1}</span>}
          />
          {filteredColumns}

          <FilterRow visible />
          <HeaderFilter visible />
          <GroupPanel visible />
          <Scrolling mode="standard" />
          <Grouping autoExpandAll={false} />
          <Editing allowDeleting allowUpdating />


        </DataGrid>
        <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn xóa không?</DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteModal(false)}>Hủy</Button>
            <Button color="error" onClick={() => handleDeleteClick()}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }));

export default DataTable;
