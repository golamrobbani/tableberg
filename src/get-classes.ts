//@ts-ignore
import { isUndefined, trim, isEmpty } from "lodash";
import { TablebergBlockAttrs } from "./types";

export function getStyleClass(attributes: TablebergBlockAttrs) {
    const { tableWidth, tableAlignment, enableInnerBorder } = attributes;
    const isValueEmpty = (value: any) => {
        return (
            isUndefined(value) ||
            value === false ||
            trim(value) === "" ||
            trim(value) === "undefined undefined undefined" ||
            isEmpty(value)
        );
    };

    return {
        "has-table-width": !isValueEmpty(tableWidth),
        "has-inner-border": enableInnerBorder,
        [`justify-table-${tableAlignment}`]: !isValueEmpty(tableAlignment),
    };
}
