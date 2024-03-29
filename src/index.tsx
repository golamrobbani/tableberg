/**
 * WordPress Imports
 */
//@ts-ignore
import { useEffect } from "@wordpress/element";
import { Placeholder, TextControl, Button } from "@wordpress/components";
import { blockTable } from "@wordpress/icons";
import { useDispatch, useSelect } from "@wordpress/data";
import {
    useBlockProps,
    useInnerBlocksProps,
    store as blockEditorStore,
    BlockIcon,
} from "@wordpress/block-editor";
import {
    BlockEditProps,
    InnerBlockTemplate,
    // @ts-ignore
    createBlocksFromInnerBlocksTemplate,
    registerBlockType,
} from "@wordpress/blocks";
/**
 * Internal Imports
 */
import "./style.scss";
import metadata from "./block.json";
import { FormEvent, useState } from "react";
import Inspector from "./inspector";
import { TablebergBlockAttrs } from "./types";
import { getStyles } from "./get-styles";
import classNames from "classnames";
import { getStyleClass } from "./get-classes";

const ALLOWED_BLOCKS = ["tableberg/row"];

function edit(props: BlockEditProps<TablebergBlockAttrs>) {
    const {
        attributes: {
            hasTableCreated,
            enableTableFooter,
            enableTableHeader,
            cols,
        },
        setAttributes,
        clientId,
    } = props;

    const blockProps = useBlockProps({
        className: classNames(getStyleClass(props.attributes)),
        style: getStyles(props.attributes),
    });

    // @ts-ignore
    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        // @ts-ignore false can obviously be assigned to renderAppender as does wordpress in their own blocks. Need to make a pr to @types/wordpress__block-editor.
        renderAppender: false,
        allowedBlocks: ALLOWED_BLOCKS,
    });

    //@ts-ignore
    const { block } = useSelect((select) => {
        return {
            //@ts-ignore
            block: select(blockEditorStore).getBlock(clientId),
        };
    });

    const { replaceInnerBlocks, insertBlocks, removeBlock } =
        useDispatch(blockEditorStore);

    const [initialRowCount, setInitialRowCount] = useState<number | "">(2);
    const [initialColCount, setInitialColCount] = useState<number | "">(2);

    useEffect(() => {
        if (enableTableHeader) {
            const tableHeaderTemplate = [
                [
                    "tableberg/row",
                    { isHeader: true },
                    new Array(initialColCount)
                        .fill(0)
                        .map(() => ["tableberg/cell", { tagName: "th" }, []]),
                ],
            ];
            insertBlocks(
                createBlocksFromInnerBlocksTemplate(tableHeaderTemplate),
                0,
                clientId
            );
        } else {
            const firstBlock = block.innerBlocks[0];
            const isHeader = firstBlock?.attributes?.isHeader;

            if (isHeader) {
                removeBlock(firstBlock.clientId);
            }
        }
    }, [enableTableHeader]);
    useEffect(() => {
        if (enableTableFooter) {
            const tableHeaderTemplate = [
                [
                    "tableberg/row",
                    { isFooter: true },
                    new Array(initialColCount)
                        .fill(0)
                        .map(() => ["tableberg/cell", { tagName: "th" }, []]),
                ],
            ];
            insertBlocks(
                createBlocksFromInnerBlocksTemplate(tableHeaderTemplate),
                block?.innerBlocks?.length + 1,
                clientId
            );
        } else {
            const firstBlock = block.innerBlocks[0];
            const isHeader = firstBlock?.attributes?.isHeader;

            if (isHeader) {
                removeBlock(firstBlock.clientId);
            }
        }
    }, [enableTableFooter]);

    function onCreateTable(event: FormEvent) {
        event.preventDefault();

        if (initialRowCount === "" || initialColCount === "") return;

        const initialInnerBlocks: InnerBlockTemplate[] = Array.from(
            { length: initialRowCount },
            () => [
                "tableberg/row",
                {},
                Array.from({ length: initialColCount }, () => [
                    "tableberg/cell",
                ]),
            ]
        );

        replaceInnerBlocks(
            clientId,
            createBlocksFromInnerBlocksTemplate(initialInnerBlocks)
        );
        setAttributes({
            hasTableCreated: true,
            rows: initialColCount,
            cols: initialColCount,
        });
    }

    function onChangeInitialColCount(count: string) {
        const value = count === "" ? "" : parseInt(count, 10) || 2;
        setInitialColCount(value);
    }

    function onChangeInitialRowCount(count: string) {
        const value = count === "" ? "" : parseInt(count, 10) || 2;
        setInitialRowCount(value);
    }

    const placeholder = (
        <Placeholder
            label={"Create Tableberg Table"}
            icon={<BlockIcon icon={blockTable} showColors />}
            instructions={"Create a complex table with all types of element"}
        >
            <form
                className="blocks-table__placeholder-form"
                onSubmit={onCreateTable}
            >
                <TextControl
                    __nextHasNoMarginBottom
                    type="number"
                    label={"Column count"}
                    value={initialColCount}
                    onChange={onChangeInitialColCount}
                    min="1"
                    className="blocks-table__placeholder-input"
                />
                <TextControl
                    __nextHasNoMarginBottom
                    type="number"
                    label={"Row count"}
                    value={initialRowCount}
                    onChange={onChangeInitialRowCount}
                    min="1"
                    className="blocks-table__placeholder-input"
                />
                <Button
                    className="blocks-table__placeholder-button"
                    variant="primary"
                    type="submit"
                >
                    {"Create Table"}
                </Button>
            </form>
        </Placeholder>
    );

    return (
        <>
            {hasTableCreated ? <table {...innerBlocksProps} /> : placeholder}
            <Inspector {...props} />
        </>
    );
}

function save() {
    const blockProps = useBlockProps.save();
    const innerBlocksProps = useInnerBlocksProps.save(blockProps);
    return <table {...innerBlocksProps} />;
}

//@ts-ignore
registerBlockType(metadata.name, {
    title: metadata.title,
    category: metadata.category,
    attributes: metadata.attributes,
    edit,
    save,
});
