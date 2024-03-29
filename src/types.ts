export interface SingleBorderTypes {
    width?: string;
    style?: string;
    color?: string;
}
export interface BorderTypes {
    top?: SingleBorderTypes;
    right?: SingleBorderTypes;
    bottom?: SingleBorderTypes;
    left?: SingleBorderTypes;
}
export interface PaddingTypes {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
}
export interface TablebergBlockAttrs {
    rows: number;
    cols: number;
    hasTableCreated: boolean;
    tableWidth: string;
    enableTableHeader: boolean;
    enableTableFooter: boolean;
    tableAlignment: string;
    cellPadding: PaddingTypes;
    headerBackgroundColor: string | null;
    headerBackgroundGradient: string | null;
    evenRowBackgroundColor: string | null;
    evenRowBackgroundGradient: string | null;
    oddRowBackgroundColor: string | null;
    oddRowBackgroundGradient: string | null;
    footerBackgroundColor: string | null;
    footerBackgroundGradient: string | null;
    tableBorder: BorderTypes;
    innerBorder: BorderTypes;
    enableInnerBorder: boolean;
}
