import React, { forwardRef, ReactNode, useEffect, useMemo, useRef, useState } from "react";
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
} from "devextreme-react/data-grid";
import { createStore } from "devextreme-aspnet-data-nojquery";
import { DataType } from "devextreme/ui/data_grid";
import { cp, truncate } from "fs";
import AddAndEditModal from "../Modal/AddAndEditModal";
import Api from "../../Api/api";
import showNotification from "../extras/showNotification";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
interface CustomDataGridProps {
  url: string;
  keyField: string;
  columns: TitleColTable[];
  pageSize?: number;
  displayCol?: string[];
  loai: string;
  setOpenModal: (status: boolean) => void;
  idItemCurrent: React.MutableRefObject<number>;
  // getContentModal: (idItem: number, url: string) => JSX.Element;
}
interface TitleColTable {
  TENTRUONG: string; TENCOT?: string; KIEUDULIEU?: string; LOOKUPURL?: string; RULES?: string, HIENTHI?: number,
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

const DataTable: React.FC<CustomDataGridProps> = ({
  url, keyField, columns, pageSize = 10, displayCol, loai,idItemCurrent,setOpenModal
}) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idItem, setidItem] = useState(0);
  const gridRef = useRef<DataGrid>(null);
  const dataSource =createStore({
    key: keyField,
    loadUrl: `${url}/GetDataForTable?loai=${loai}`,
    insertUrl: `${url}/InsertOrder`,
    updateUrl: `${url}/UpdateOrder`,
    deleteUrl: `${url}/DeleteOrder`,
    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  });
  const parseRules = (rulesJson?: string): JSX.Element[] => {
    if (!rulesJson || typeof rulesJson !== "string") return [];

    try {
      const rules: Rule[] = JSON.parse(rulesJson);
      return rules
        .map((rule, index) => {
          switch (rule.type) {
            case "RequiredRule":
              return <RequiredRule key={index} {...rule.props} />;
            case "RangeRule":
              return <RangeRule key={index} {...rule.props} />;
            case "StringLengthRule":
              return <StringLengthRule key={index} {...rule.props} />;
            default:
              return null;
          }
        })
        .filter((rule): rule is JSX.Element => rule !== null); // Lọc bỏ giá trị `null`
    } catch (error) {
      console.error("Lỗi parse RULES:", error);
      return [];
    }
  };
  useEffect(() => {

  }, []);
  const handleEditClick = (e: any) => {
    const rowID = e.row.data.ID;
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
  // const filteredColumns = useMemo(() => {
  //   return columns.filter(col => !displayCol || displayCol.includes(col.TENTRUONG));
  // }, [columns]);
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
        <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} />
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
        {columns
          .filter(col => !displayCol || displayCol.includes(col.TENTRUONG)) // Lọc cột hiển thị
          .map((col) => {
            if (col.HIENTHI === 0 || col.TENTRUONG === 'SUAXOA') return null; // Bỏ qua cột không hiển thị
            return (
              <Column
                key={col.TENTRUONG}
                dataField={col.TENTRUONG}
                caption={col.TENCOT}
                dataType={col.KIEUDULIEU as DataType}
                alignment={col.KIEUDULIEU === "number" ? "left" : undefined}
              >
                {parseRules(col.RULES)}
              </Column>
            );
          })}

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
    </>
  );
};

export default DataTable;
