import React, { useEffect, useState } from "react";
import { t } from "i18next";
import { Button, Input } from "reactstrap";
import "flatpickr/dist/themes/material_green.css";
import Flatpickr from "react-flatpickr";

// ... (import statements remain unchanged)

export const HistoryTableFilters = ({
  filters,
  onFilterButtonClick,
  onCancelButtonClick,
}) => {
  const [range, setRange] = useState([]);

  return (
    <div className="pb-3 d-flex gap-2 align-items-center">
      <h5 className="m-0">{t("Filters")}</h5>

      {filters &&
        filters.map((filter) => {
          switch (filter.type) {
            case "date":
              return (
                <React.Fragment key={filter.name}>
                  <span>{filter.name}</span>

                  <Flatpickr
                    data-disable-time
                    id={filter.name}
                    className=" form-control"
                    options={{
                      mode: "range",
                      maxDate: new Date(),
                      dateFormat: "D-M-Y",
                    }}
                    value={range}
                    onChange={(e) => {
                      setRange(e);
                      filter.onChange(e);
                    }}
                  />
                </React.Fragment>
              );
              break;

            case "select":
              return (
                <React.Fragment key={filter.name}>
                  <span>{filter.name}</span>

                  <Input
                    name={filter.name}
                    placeholder={filter.placeholder || "Select"}
                    className={`${filter.className}`}
                    onChange={filter.onChange}
                    type="select"
                  >
                    <option value={""}>{filter.placeholder || "Select"}</option>
                    {filter.selectOptions &&
                      filter.selectOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {t(option.displayText)}{" "}
                          {option.value === "" && filter.colName}
                        </option>
                      ))}
                  </Input>
                </React.Fragment>
              );
              break;

            default:
              return (
                <React.Fragment key={filter.name}>
                  <span>{filter.name}</span>

                  <Input
                    name={filter.name}
                    placeholder={filter.colName}
                    className={`${filter.className}`}
                    onChange={filter.onChange}
                    value={filter.value !== undefined ? filter.value : ""}
                    type={filter.type || "text"}
                  />
                </React.Fragment>
              );
              break;
          }
        })}
      <Button color="secondary" onClick={onFilterButtonClick}>
        {t("Filter")}
      </Button>
      <Button color="danger" onClick={onCancelButtonClick}>
        {t("Cancel")}
      </Button>
    </div>
  );
};
