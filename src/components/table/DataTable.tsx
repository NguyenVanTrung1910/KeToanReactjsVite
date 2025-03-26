import React, { forwardRef, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import 'devextreme/data/odata/store';
import {
  Column,
  Button,
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
interface CustomDataGridProps {
  url: string;
  keyField: string;
  columns: TitleColTable[];
  pageSize?: number;
  displayCol?: string[];
  loai: string;
  getContentModal: (idItem: number, url: string) => JSX.Element;
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
  url, keyField, columns, pageSize = 10, displayCol, loai, getContentModal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [idItem, setidItem] = useState(0);
  const gridRef = useRef<DataGrid>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const dataSource = useMemo(() => createStore({
    key: keyField,
    loadUrl: `${url}/GetDataForTable?loai=${loai}`,
    insertUrl: `${url}/InsertOrder`,
    updateUrl: `${url}/UpdateOrder`,
    deleteUrl: `${url}/DeleteOrder`,
    onBeforeSend: (method, ajaxOptions) => {
      ajaxOptions.xhrFields = { withCredentials: true };
    },
  }), [keyField, url, loai, reloadTrigger]);
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
    if (!isOpen && gridRef.current) {
      gridRef.current.instance.getDataSource().reload();
      gridRef.current.instance.getDataSource().load();
    }
  }, [isOpen]);
  const handleEditClick = (e: any) => {
    const rowID = e.row.data.ID;
    console.log("ID cần sửa:", rowID);
    setIsOpen(true)
    setidItem(rowID)
  };
  const reloadGrid = () => {
    setReloadTrigger(prev => prev + 1);
    if (gridRef.current) {
      const dataSource1 = gridRef.current.instance.getDataSource();
      if (dataSource1) {
        dataSource1.reload(); // Reload dữ liệu
        dataSource1.load(); // Reload dữ liệu
      }
    }

  };

  const handleDeleteClick = (e: any) => {
    const rowID = e.row.data.ID;
    const deleteData = async () => {
      try {
        const response = await Api.delete(`${url}/XoaDong`, {
          params: {
            TenBang: loai,
            IDcmd: rowID
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
              onClick: handleDeleteClick,
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
      <AddAndEditModal content={getContentModal(idItem, '')} isOpen={isOpen} setIsOpen={setIsOpen} nameButton="Edit" title="Sửa thông tin" includeButton={false} />
    </>
  );
};

export default DataTable;
