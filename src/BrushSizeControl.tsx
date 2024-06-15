import { Stack } from '@fluentui/react';
import { Field, makeStyles, SpinButton, SpinButtonProps, tokens } from '@fluentui/react-components';
import React from 'react';
import { ARENA_BACKGROUND_COLOR } from './render/SceneTheme';
import { useControlStyles } from './useControlStyles';

const BOX_SIZE = 30;

export interface BrushSizeControlProps extends SpinButtonProps {
    color: string;
    opacity: number;
}

export const BrushSizeControl: React.FC<BrushSizeControlProps> = ({ color, opacity, ...props }) => {
    const classes = useStyles();
    const controlClasses = useControlStyles();

    const size = props.value ?? 0;
    const pos = Math.max(BOX_SIZE / 2, size / 2);

    return (
        <div className={controlClasses.row}>
            <Field label="Brush size">
                <SpinButton min={2} step={2} {...props} />
            </Field>
            <Stack.Item>
                <div className={classes.container}>
                    <svg width={BOX_SIZE} height={BOX_SIZE}>
                        <circle cx={pos} cy={pos} r={size / 2} fill={color} opacity={opacity / 100} />
                    </svg>
                </div>
            </Stack.Item>
        </div>
    );
};

const useStyles = makeStyles({
    container: {
        width: `${BOX_SIZE}px`,
        height: `${BOX_SIZE}px`,
        background: ARENA_BACKGROUND_COLOR,
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        borderRadius: tokens.borderRadiusMedium,
        overflow: 'hidden',
    },
});
