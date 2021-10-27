import { IconButton, IStackTokens, Label, Stack } from '@fluentui/react';
import { ArrowConfig } from 'konva/lib/shapes/Arrow';
import * as React from 'react';
import { Arrow, Group, Rect } from 'react-konva';
import icon from '../assets/marker/arrow.png';
import { CompactColorPicker } from '../CompactColorPicker';
import { OpacitySlider } from '../OpacitySlider';
import { DetailsItem } from '../panel/DetailsItem';
import { ListComponentProps, registerListComponent } from '../panel/ObjectList';
import { PropertiesControlProps, registerPropertiesControl } from '../panel/PropertiesPanel';
import { getDragOffset, registerDropHandler, usePanelDrag } from '../PanelDragProvider';
import { LayerName } from '../render/layers';
import { registerRenderer, RendererProps } from '../render/ObjectRenderer';
import { COLOR_SWATCHES, SELECTED_PROPS } from '../render/SceneTheme';
import { ArrowObject, ObjectType } from '../scene';
import { useScene } from '../SceneProvider';
import { setOrOmit } from '../util';
import { ResizeableObjectProperties } from './CommonProperties';
import { useShowHighlight } from './highlight';
import { PrefabIcon } from './PrefabIcon';
import { ResizeableObjectContainer } from './ResizeableObjectContainer';

// TODO: This would be a lot nicer if you could just click on start position
// and drag to end position instead of having a set initial size/rotation.

const NAME = 'Arrow';

const DEFAULT_ARROW_WIDTH = 20;
const DEFAULT_ARROW_HEIGHT = 150;
const DEFAULT_ARROW_COLOR = '#000000';
const DEFAULT_ARROW_OPACITY = 100;

export const MarkerArrow: React.FC = () => {
    const [, setDragObject] = usePanelDrag();

    return (
        <PrefabIcon
            draggable
            name={NAME}
            icon={icon}
            onDragStart={(e) => {
                setDragObject({
                    object: {
                        type: ObjectType.Arrow,
                        width: DEFAULT_ARROW_WIDTH,
                        height: DEFAULT_ARROW_HEIGHT,
                        arrowEnd: true,
                    },
                    offset: getDragOffset(e),
                });
            }}
        />
    );
};

registerDropHandler<ArrowObject>(ObjectType.Arrow, (object, position) => {
    return {
        type: 'add',
        object: {
            type: ObjectType.Arrow,
            color: DEFAULT_ARROW_COLOR,
            opacity: DEFAULT_ARROW_OPACITY,
            width: DEFAULT_ARROW_WIDTH,
            height: DEFAULT_ARROW_HEIGHT,
            rotation: 0,
            ...object,
            ...position,
        },
    };
});

const STROKE_WIDTH = DEFAULT_ARROW_WIDTH / 5;
const POINTS = [DEFAULT_ARROW_WIDTH / 2, DEFAULT_ARROW_HEIGHT, DEFAULT_ARROW_WIDTH / 2, 0];

const HIGHLIGHT_STROKE_WIDTH = STROKE_WIDTH + (SELECTED_PROPS.strokeWidth ?? 0);

const ArrowRenderer: React.FC<RendererProps<ArrowObject>> = ({ object, index }) => {
    const showHighlight = useShowHighlight(object, index);

    const arrowProps: ArrowConfig = {
        points: POINTS,
        width: DEFAULT_ARROW_WIDTH,
        height: DEFAULT_ARROW_HEIGHT,
        scaleX: object.width / DEFAULT_ARROW_WIDTH,
        scaleY: object.height / DEFAULT_ARROW_HEIGHT,
        pointerLength: DEFAULT_ARROW_HEIGHT * 0.15,
        pointerWidth: DEFAULT_ARROW_WIDTH * 0.8,
        strokeWidth: STROKE_WIDTH,
        lineCap: 'round',
        pointerAtBeginning: !!object.arrowBegin,
        pointerAtEnding: !!object.arrowEnd,
    };

    console.log(arrowProps);

    return (
        <ResizeableObjectContainer
            object={object}
            index={index}
            cache
            cacheKey={showHighlight}
            transformerProps={{ centeredScaling: true }}
        >
            {(groupProps) => (
                <Group {...groupProps} opacity={object.opacity / 100}>
                    <Rect width={object.width} height={object.height} fill="transparent" />
                    {showHighlight && (
                        <Arrow {...arrowProps} {...SELECTED_PROPS} strokeWidth={HIGHLIGHT_STROKE_WIDTH} />
                    )}

                    <Arrow {...arrowProps} fill={object.color} stroke={object.color} />
                </Group>
            )}
        </ResizeableObjectContainer>
    );
};

registerRenderer<ArrowObject>(ObjectType.Arrow, LayerName.Default, ArrowRenderer);

const ArrowDetails: React.FC<ListComponentProps<ArrowObject>> = ({ index }) => {
    // TODO: color filter icon?
    return <DetailsItem icon={icon} name={NAME} index={index} />;
};

registerListComponent<ArrowObject>(ObjectType.Arrow, ArrowDetails);

const stackTokens: IStackTokens = {
    childrenGap: 10,
};

const ArrowEditControl: React.FC<PropertiesControlProps<ArrowObject>> = ({ object, index }) => {
    const [, dispatch] = useScene();

    const onColorChanged = React.useCallback(
        (color: string) => dispatch({ type: 'update', index, value: { ...object, color } }),
        [dispatch, object, index],
    );

    const onToggleArrowBegin = React.useCallback(
        () => dispatch({ type: 'update', index, value: setOrOmit(object, 'arrowBegin', !object.arrowBegin) }),
        [dispatch, object, index],
    );

    const onToggleArrowEnd = React.useCallback(
        () => dispatch({ type: 'update', index, value: setOrOmit(object, 'arrowEnd', !object.arrowEnd) }),
        [dispatch, object, index],
    );

    const onOpacityChanged = React.useCallback(
        (opacity: number) => {
            if (opacity !== object.opacity) {
                dispatch({ type: 'update', index, value: { ...object, opacity } });
            }
        },
        [dispatch, object, index],
    );

    const arrowBeginIcon = object.arrowBegin ? 'TriangleSolidLeft12' : 'Remove';
    const arrowEndIcon = object.arrowEnd ? 'TriangleSolidRight12' : 'Remove';

    return (
        <Stack>
            <Stack horizontal tokens={stackTokens} verticalAlign="end">
                <CompactColorPicker
                    label="Color"
                    color={object.color}
                    swatches={COLOR_SWATCHES}
                    onChange={onColorChanged}
                />
                <Stack>
                    <Label>Pointers</Label>

                    <Stack horizontal>
                        <IconButton iconProps={{ iconName: arrowBeginIcon }} onClick={onToggleArrowBegin} />
                        <IconButton iconProps={{ iconName: arrowEndIcon }} onClick={onToggleArrowEnd} />
                    </Stack>
                </Stack>
            </Stack>
            <OpacitySlider value={object.opacity} onChange={onOpacityChanged} />
            <ResizeableObjectProperties object={object} index={index} />
        </Stack>
    );
};

registerPropertiesControl<ArrowObject>(ObjectType.Arrow, ArrowEditControl);
