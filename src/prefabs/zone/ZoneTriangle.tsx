import { RectConfig } from 'konva/lib/shapes/Rect';
import React, { useMemo } from 'react';
import { Group, Line } from 'react-konva';
import icon from '../../assets/zone/triangle.png';
import { DetailsItem } from '../../panel/DetailsItem';
import { ListComponentProps, registerListComponent } from '../../panel/ObjectList';
import { getDragOffset, registerDropHandler, usePanelDrag } from '../../PanelDragProvider';
import { LayerName } from '../../render/layers';
import { registerRenderer, RendererProps } from '../../render/ObjectRenderer';
import { DEFAULT_AOE_COLOR, DEFAULT_AOE_OPACITY, SELECTED_PROPS } from '../../render/SceneTheme';
import { ObjectType, RectangleZone } from '../../scene';
import { useShowHighlight } from '../highlight';
import { PrefabIcon } from '../PrefabIcon';
import { ResizeableObjectContainer } from '../ResizeableObjectContainer';
import { getZoneStyle } from './style';

const NAME = 'Triangle';

const DEFAULT_TRIANGLE_WIDTH = 100;
const DEFAULT_TRIANGLE_HEIGHT = Math.floor((DEFAULT_TRIANGLE_WIDTH * Math.sqrt(3)) / 2);

export const ZoneTriangle: React.FunctionComponent = () => {
    const [, setDragObject] = usePanelDrag();
    return (
        <PrefabIcon
            draggable
            name={NAME}
            icon={icon}
            onDragStart={(e) => {
                setDragObject({
                    object: {
                        type: ObjectType.Triangle,
                        width: DEFAULT_TRIANGLE_WIDTH,
                        height: DEFAULT_TRIANGLE_HEIGHT,
                    },
                    offset: getDragOffset(e),
                });
            }}
        />
    );
};

registerDropHandler<RectangleZone>(ObjectType.Triangle, (object, position) => {
    return {
        type: 'add',
        object: {
            type: ObjectType.Triangle,
            color: DEFAULT_AOE_COLOR,
            opacity: DEFAULT_AOE_OPACITY,
            width: DEFAULT_TRIANGLE_WIDTH,
            height: DEFAULT_TRIANGLE_HEIGHT,
            rotation: 0,
            ...object,
            ...position,
        },
    };
});

const EquilateralTriangle: React.FC<RectConfig> = ({ width, height, ...props }) => {
    const points = useMemo(() => {
        const w = width ?? 0;
        const h = height ?? 0;
        // prettier-ignore
        return [
            w / 2, 0,
            0, h,
            w, h
        ];
    }, [width, height]);

    return <Line points={points} closed {...props} />;
};

const TriangleRenderer: React.FC<RendererProps<RectangleZone>> = ({ object }) => {
    const showHighlight = useShowHighlight(object);
    const style = useMemo(
        () => getZoneStyle(object.color, object.opacity, Math.min(object.width, object.height), object.hollow),
        [object.color, object.opacity, object.width, object.height, object.hollow],
    );

    const highlightOffset = style.strokeWidth;
    const highlightWidth = object.width + highlightOffset;
    const highlightHeight = object.height + highlightOffset;

    const offsetY = (object.height * 2) / 3;

    return (
        <ResizeableObjectContainer object={object} transformerProps={{ centeredScaling: true }}>
            {(groupProps) => (
                <Group {...groupProps} offsetY={offsetY}>
                    {showHighlight && (
                        <EquilateralTriangle
                            offsetX={highlightOffset / 2}
                            offsetY={highlightOffset / 2}
                            width={highlightWidth}
                            height={highlightHeight}
                            {...SELECTED_PROPS}
                        />
                    )}
                    <EquilateralTriangle width={object.width} height={object.height} {...style} />
                </Group>
            )}
        </ResizeableObjectContainer>
    );
};

registerRenderer<RectangleZone>(ObjectType.Triangle, LayerName.Ground, TriangleRenderer);

const TriangleDetails: React.FC<ListComponentProps<RectangleZone>> = ({ object }) => {
    // TODO: color filter icon?
    return <DetailsItem icon={icon} name={NAME} object={object} />;
};

registerListComponent<RectangleZone>(ObjectType.Triangle, TriangleDetails);

// Properties control registered in ZoneRectangle.tsx
