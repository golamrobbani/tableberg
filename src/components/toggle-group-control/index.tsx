/**
 * WordPress Dependencies
 */
import { useDispatch, useSelect } from "@wordpress/data";
//@ts-ignore
import { useBlockEditContext } from "@wordpress/block-editor";
import {
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";
import { ToggleGroupControlPropTypes } from "../types";

function CustomToggleGroupControl({
    label,
    options,
    attributeKey,
    isBlock = false,
    isAdaptiveWidth = false,
    isDeselectable = false,
}: ToggleGroupControlPropTypes) {
    const { clientId } = useBlockEditContext();
    const { updateBlockAttributes } = useDispatch("core/block-editor");

    //@ts-ignore
    const attributes = useSelect((select) => {
        //@ts-ignore
        return select("core/block-editor").getBlockAttributes(clientId);
    });
    const setAttributes = (newAttributes: object) =>
        updateBlockAttributes(clientId, newAttributes);

    return (
        <ToggleGroupControl
            label={label}
            isBlock={isBlock}
            isDeselectable={isDeselectable}
            isAdaptiveWidth={isAdaptiveWidth}
            __nextHasNoMarginBottom
            value={attributes[attributeKey]}
            onChange={(newValue) => {
                setAttributes({
                    [attributeKey]: newValue,
                });
            }}
        >
            {options.map(({ value, icon = null, label }) => {
                return icon ? (
                    <ToggleGroupControlOptionIcon
                        key={value}
                        value={value}
                        icon={icon}
                        label={label}
                    />
                ) : (
                    <ToggleGroupControlOption
                        key={value}
                        value={value}
                        label={label}
                    />
                );
            })}
        </ToggleGroupControl>
    );
}

export default CustomToggleGroupControl;
