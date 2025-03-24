import React, { ReactNode, useState } from "react";
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
interface CustomDataGridProps {
  url: string;
  keyField: string;
  columns: TitleColTable[];
  pageSize?: number;
  displayCol?: string[];
  loai: string;
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
const DataTable: React.FC<CustomDataGridProps> = ({ url, keyField, columns, pageSize = 10, displayCol, loai }) => {
  const dataSource = createStore({
    key: keyField,
    loadUrl: `${url}/GetDataForTable?loai=${loai}`,
    insertUrl: `${url}/InsertOrder`,
    updateUrl: `${url}/UpdateOrder`,
    deleteUrl: `${url}/DeleteOrder`,

    // paginate: true,
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
  const [selectedId, setSelectedId] = useState(null);

  const handleEditClick = (e: any) => {
    const rowID = e.row.data.ID;
    console.log("ID cần sửa:", rowID);
    setSelectedId(rowID);
    // Mở modal ở đây
  };

  const handleDeleteClick = (e: any) => {
    const rowID = e.row.data.ID;
    console.log("ID cần xóa:", rowID);
    // Gọi API xóa nếu cần
  };
  return (
    <DataGrid dataSource={dataSource} showBorders height={600} remoteOperations={true} columnAutoWidth={true}  // Đặt cột tự động căn chỉnh độ rộng
      // columnMinWidth={90}
      groupPanel={{
        visible: true,
        emptyPanelText: "Nhóm dữ liệu bằng cách kéo cột vào đây!"
      }}

      onEditingStart={(e) => {
        console.log("Sửa hàng có ID:", e.data.ID);
      }}
      onRowRemoving={(e) => {
        console.log("Xóa hàng có ID:", e.data.ID);
      }}

    >
      <Paging enabled={true} defaultPageSize={pageSize} />
      <Pager showPageSizeSelector={true} allowedPageSizes={[5, 10, 20]} showInfo={true} />
      <Column
        caption="STT"
        width={60}
        cellRender={(data) => <span>{data.component.pageIndex() * data.component.pageSize() + data.rowIndex + 1}</span>}
      />
      {columns
        .filter(col => !displayCol || displayCol.includes(col.TENTRUONG)) // Lọc cột hiển thị
        .map((col) => {
          if (col.HIENTHI === 0) return null; // Bỏ qua cột không hiển thị
          if (col.TENTRUONG === 'SUAXOA') {
            return (
              <Column type="buttons" width={90} caption={col.TENCOT} alignment='left' buttons={[
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
            )
          }
          return (
            <Column
              key={col.TENTRUONG}
              dataField={col.TENTRUONG}
              caption={col.TENCOT}
              dataType={col.KIEUDULIEU as DataType}
              alignment={col.KIEUDULIEU === "number" ? "left" : undefined}
            >
              {col.LOOKUPURL !== "/" && (
                <Lookup
                  dataSource={createStore({
                    key: "Value",
                    loadUrl: col.LOOKUPURL,
                    onBeforeSend: (method, ajaxOptions) => {
                      ajaxOptions.xhrFields = { withCredentials: true };
                    },
                  })}
                  valueExpr="Value"
                  displayExpr="Text"
                />
              )}
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
  );
};

export default DataTable;
