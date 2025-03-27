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
  Lookup,
  Summary,
  GroupItem,
  TotalItem,
  ValueFormat,
  Paging,
  Pager,
  RequiredRule,
  RangeRule,
  StringLengthRule,
  Item,
} from "devextreme-react/data-grid";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DataType } from "devextreme/ui/data_grid";
import { cp, truncate } from "fs";
import AddAndEditModal from "../Modal/AddAndEditModal";
import Api from "../../Api/api";
import showNotification from "../extras/showNotification";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
import { Toolbar } from "devextreme-react";
interface CustomDataGridProps {
  url: string;
  keyField: string;
  columns: TitleColTable[];
  pageSize?: number;
  displayCol?: string[];
  loai: string;
  setOpenModal: (status: boolean) => void;
  idItemCurrent: React.MutableRefObject<number>;
  isOpenModal?: boolean
  // getContentModal: (idItem: number, url: string) => JSX.Element;
}
export interface DataTableRef {
  exportToExcel: () => void; // Expose function này ra ngoài cho component cha gọi
}
interface TitleColTable {
  TENTRUONG: string; TENCOT?: string; KIEUDULIEU?: string; LOOKUPURL?: string; FORMAT?: string, HIENTHI?: number,
}
type RuleType = "RequiredRule" | "RangeRule" | "StringLengthRule";

interface RuleProps {
  message?: string;
  min?: number;
  max?: number;
}

interface Rule {
  type: RuleType;
  props?: RuleProps;
}
interface ColumnProps {
  col: TitleColTable;
}

// const DataTable: React.FC<CustomDataGridProps> = ({
//   url, keyField, columns, pageSize = 100, displayCol, loai, idItemCurrent, setOpenModal, isOpenModal
// }) 
const DataTable = forwardRef<DataTableRef, CustomDataGridProps>(
  ({ url, keyField, columns, pageSize = 100, displayCol, loai, idItemCurrent, setOpenModal, isOpenModal }, ref) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idItem, setidItem] = useState(0);
  const gridRef = useRef<DataGrid>(null);
  useImperativeHandle(ref, () => ({
    exportToExcel,
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

  useEffect(() => {
    if (!isOpenModal) {
      reloadGrid();
    }
  }, [url, loai, isOpenModal]);
  useEffect(() => {

  }, []);
  const handleEditClick = (e: any) => {
    const rowID = e.row.data.ID;
    const a = e.row.data.MADOITUONG;
    setidItem(rowID)
    idItemCurrent.current = rowID
    setOpenModal(true)
  };
  const reloadGrid = () => {
    if (gridRef.current) {
      const dataSource1 = gridRef.current.instance.getDataSource();
      if (dataSource1) {
        dataSource1.reload(); // Reload dữ liệu
        dataSource1.load(); // Reload dữ liệu
      }
    }

  };
  const handleOpenModal = (e: any) => {
    const rowID = e.row.data.ID;
    setidItem(rowID)
    setOpenDeleteModal(true)
  };
  const handleDeleteClick = () => {
    const deleteData = async () => {
      try {
        const response = await Api.delete(`${url}/XoaDong`, {
          params: {
            TenBang: loai,
            IDcmd: idItem
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

    // Gọi API xóa nếu cần
  };
  const filteredColumns = useMemo(() => {
    return columns
      .filter(col => !displayCol || displayCol.includes(col.TENTRUONG)) // Lọc cột hiển thị
      .map((col) => {
        console.log('change coll')
        if (col.HIENTHI === 0 || col.TENTRUONG === 'SUAXOA') return null; // Bỏ qua cột không hiển thị
        return (
          <Column
            key={col.TENTRUONG}
            dataField={col.TENTRUONG}
            caption={col.TENCOT}
            dataType={col.KIEUDULIEU as DataType}
            alignment={col.KIEUDULIEU === "number" ? "left" : col.KIEUDULIEU === "bool" ? "center" : undefined}
            //format={col.KIEUDULIEU === "number" ? { type: "fixedPoint", precision: 2 } : undefined}
            //format="#,##0.##"
            format={col.FORMAT}
            cellRender={(cellData) => {
              // if (col.KIEUDULIEU === "number") {
              //   // Nếu là số -> Hiển thị màu đỏ + định dạng tiền VNĐ
              //   const value = cellData.value ? cellData.value.toFixed(2) : "0";;
              //   return <span>{value}</span>;
              // } 
              
              if (col.KIEUDULIEU === "bool") {
                // Nếu là boolean -> Hiển thị dấu tích cho true, rỗng cho false
                return cellData.value ? <span style={{ fontSize: "16px" }}>✓</span> : <span></span>;
              }
          
              // Nếu là kiểu dữ liệu khác -> Hiển thị bình thường
              return <span>{cellData.value}</span>;
            }}
          >
          </Column>
        );
      });
  }, [columns, displayCol]);
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
  
  
  return (
    <>
      <DataGrid dataSource={dataSource} ref={gridRef} showBorders height={700} remoteOperations={true} columnAutoWidth={true}  // Đặt cột tự động căn chỉnh độ rộng
        // columnMinWidth={90}
        groupPanel={{
          visible: true,
          emptyPanelText: "Nhóm dữ liệu bằng cách kéo cột vào đây!"
        }}

      >
        <Paging enabled={true} defaultPageSize={pageSize} />
        <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20,100]} showInfo={true} />
        <Column
          caption="STT"
          width={70}
          cellRender={(data) => <span>{data.component.pageIndex() * data.component.pageSize() + data.rowIndex + 1}</span>}
        />
        {columns.some(col => col.TENTRUONG === 'SUAXOA') &&
          <Column type="buttons" width={90} caption="Sửa-Xóa" alignment='left' buttons={[
            {
              hint: "Sửa",
              icon: "edit",
              onClick: handleEditClick,
            },
            {
              hint: "Xóa",
              icon: "trash",
              onClick: handleOpenModal,
            },
          ]}>
          </Column>

        }
        {filteredColumns}

        {/* Các thành phần UI khác */}
        <FilterRow visible />
        <HeaderFilter visible />
        <GroupPanel visible />
        <Scrolling mode="standard" />
        <Grouping autoExpandAll={false} />
        {columns.some(col => col.TENTRUONG === 'SUAXOA') &&
          <Editing allowDeleting allowUpdating />

        }
      </DataGrid>
      <Dialog open={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>Bạn có chắc chắn muốn xóa không?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteModal(false)}>Hủy</Button>
          <Button color="error" onClick={handleDeleteClick}>Xóa</Button>
        </DialogActions>
      </Dialog>
      <Toolbar>
        <Item location="before" widget="dxButton" options={{
          text: "Xuất Excel",
          icon: "exportxlsx",
          onClick: exportToExcel
        }} />
          </Toolbar>
    </>
  );
});

export default DataTable;
