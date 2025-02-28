import { errorMessages, Position } from "@xyflow/system";
import clsx from "clsx";
import {
  type Accessor,
  createContext,
  createEffect,
  createSignal,
  mergeProps,
  onCleanup,
  Show,
} from "solid-js";
import { Dynamic } from "solid-js/web";

import createDraggable from "@/actions/createDraggable";
import { useFlowStore } from "@/components/contexts";
import type { InternalNode, Node, NodeEventCallbacks } from "@/shared/types";

import DefaultNode from "./DefaultNode";

function getNodeInlineStyleDimensions({
  width,
  height,
  initialWidth,
  initialHeight,
  measuredWidth,
  measuredHeight,
}: {
  width?: number;
  height?: number;
  initialWidth?: number;
  initialHeight?: number;
  measuredWidth?: number;
  measuredHeight?: number;
}): {
  width: string | undefined;
  height: string | undefined;
} {
  if (measuredWidth === undefined && measuredHeight === undefined) {
    const styleWidth = width ?? initialWidth;
    const styleHeight = height ?? initialHeight;

    return {
      width: styleWidth ? `width:${styleWidth}px;` : "",
      height: styleHeight ? `height:${styleHeight}px;` : "",
    };
  }

  return {
    width: width ? `width:${width}px;` : "",
    height: height ? `height:${height}px;` : "",
  };
}

export const NodeIdContext = createContext<Accessor<string>>();

export type NodeWrapperProps<NodeType extends Node = Node> = Pick<
  Node,
  | "id"
  | "class"
  | "connectable"
  | "data"
  | "draggable"
  | "dragging"
  | "selected"
  | "selectable"
  | "deletable"
  | "style"
  | "type"
  | "sourcePosition"
  | "targetPosition"
  | "dragHandle"
  | "hidden"
  | "width"
  | "height"
  | "initialWidth"
  | "initialHeight"
  | "parentId"
> &
  Partial<NodeEventCallbacks<NodeType>> & {
    readonly measuredWidth?: number;
    readonly measuredHeight?: number;
    readonly type?: string;
    readonly positionX: number;
    readonly positionY: number;
    readonly resizeObserver?: ResizeObserver | null;
    readonly isParent?: boolean;
    readonly zIndex: number;
    readonly node: InternalNode<NodeType>;
    readonly initialized?: boolean;
    readonly nodeClickDistance?: number;
  };

const NodeWrapper = <NodeType extends Node = Node>(props: NodeWrapperProps<NodeType>) => {
  const { store, updateNodeInternals, handleNodeSelection } = useFlowStore();

  const _props = mergeProps(
    {
      connectable: true,
      deletable: true,
      hidden: false,
      initialized: false,
      isParent: false,
      selected: false,
      type: "default",
    },
    props,
  );

  const [nodeRef, setNodeRef] = createSignal<HTMLDivElement>();

  let prevNodeRef: HTMLDivElement | undefined = undefined;
  let prevType: string | undefined = undefined;
  let prevSourcePosition: Position | undefined = undefined;
  let prevTargetPosition: Position | undefined = undefined;

  const nodeTypeValid = () => _props.type in store.nodeTypes;
  const nodeComponent = () => store.nodeTypes[_props.type] || DefaultNode;

  createEffect(() => {
    if (!nodeTypeValid()) {
      console.warn("003", errorMessages["error003"](_props.type!));
    }
  });

  const inlineStyleDimensions = () =>
    getNodeInlineStyleDimensions({
      width: _props.width,
      height: _props.height,
      initialWidth: _props.initialWidth,
      initialHeight: _props.initialHeight,
      measuredWidth: _props.measuredWidth,
      measuredHeight: _props.measuredHeight,
    });

  createEffect(() => {
    // if type, sourcePosition or targetPosition changes,
    // we need to re-calculate the handle positions
    const doUpdate =
      (prevType && _props.type !== prevType) ||
      (prevSourcePosition && _props.sourcePosition !== prevSourcePosition) ||
      (prevTargetPosition && _props.targetPosition !== prevTargetPosition);

    if (doUpdate) {
      requestAnimationFrame(() =>
        updateNodeInternals(
          new Map([
            [
              _props.id,
              {
                id: _props.id,
                nodeElement: nodeRef()!,
                force: true,
              },
            ],
          ]),
        ),
      );
    }

    prevType = _props.type;
    prevSourcePosition = _props.sourcePosition;
    prevTargetPosition = _props.targetPosition;
  });

  createEffect(() => {
    if (!_props.resizeObserver) return;

    if (nodeRef() !== prevNodeRef || !_props.initialized) {
      if (prevNodeRef) _props.resizeObserver.unobserve(prevNodeRef);
      if (nodeRef()) _props.resizeObserver.observe(nodeRef()!);
      prevNodeRef = nodeRef();
    }
  });

  onCleanup(() => {
    if (prevNodeRef) {
      _props.resizeObserver?.unobserve(prevNodeRef);
    }
  });

  const onSelectNodeHandler = (event: MouseEvent | TouchEvent) => {
    if (
      _props.selectable &&
      (!store.selectNodesOnDrag || !_props.draggable || store.nodeDragThreshold > 0)
    ) {
      // this handler gets called by XYDrag on drag start when selectNodesOnDrag=true
      // here we only need to call it when selectNodesOnDrag=false
      handleNodeSelection(_props.id);
    }

    _props.onNodeClick?.(_props.node, event);
  };

  createDraggable(nodeRef, () => ({
    nodeId: _props.id,
    isSelectable: _props.selectable,
    disabled: false,
    handleSelector: _props.dragHandle,
    noDragClass: "nodrag",
    nodeClickDistance: _props.nodeClickDistance,
    onNodeMouseDown: handleNodeSelection,
    onDrag: (event, _, targetNode, nodes) => {
      _props.onNodeDrag?.(targetNode, nodes, event);
    },
    onDragStart: (event, _, targetNode, nodes) => {
      _props.onNodeDragStart?.(targetNode, nodes, event);
    },
    onDragStop: (event, _, targetNode, nodes) => {
      _props.onNodeDragStop?.(targetNode, nodes, event);
    },
  }));

  const style = () => ({
    "z-index": _props.zIndex,
    transform: `translate(${_props.positionX}px, ${_props.positionY}px)`,
    visibility: _props.initialized ? "visible" : "hidden",
    ...(_props.style && typeof _props.style === "object" ? _props.style : {}),
    ...inlineStyleDimensions(),
  }) as const;

  const nodeId = () => _props.id;

  return (
    <Show when={!_props.hidden}>
      <NodeIdContext.Provider value={nodeId}>
        <div
          ref={setNodeRef}
          data-id={_props.id}
          onClick={onSelectNodeHandler}
          onMouseEnter={(event) => _props.onNodeMouseEnter?.(_props.node, event)}
          onMouseLeave={(event) => _props.onNodeMouseLeave?.(_props.node, event)}
          onMouseMove={(event) => _props.onNodeMouseMove?.(_props.node, event)}
          onContextMenu={(event) => _props.onNodeContextMenu?.(_props.node, event)}
          style={style()}
          class={clsx(
            "solid-flow__node",
            _props.type,
            {
              dragging: _props.dragging,
              selected: _props.selected,
              draggable: _props.draggable,
              connectable: _props.connectable,
              selectable: _props.selectable,
              nopan: _props.draggable,
              parent: _props.isParent,
            },
            _props.class,
          )}
        >
          <Dynamic
            component={nodeComponent()}
            data={_props.data}
            id={_props.id}
            width={`${_props.width}px`}
            height={`${_props.height}px`}
            selected={_props.selected}
            selectable={_props.selectable ?? store.elementsSelectable ?? true}
            deletable={_props.deletable}
            sourcePosition={_props.sourcePosition}
            targetPosition={_props.targetPosition}
            zIndex={_props.zIndex}
            dragging={_props.dragging ?? false}
            draggable={_props.draggable ?? store.nodesDraggable ?? true}
            dragHandle={_props.dragHandle}
            parentId={_props.parentId}
            type={_props.type}
            isConnectable={_props.connectable}
            positionAbsoluteX={_props.positionX}
            positionAbsoluteY={_props.positionY}
          />
        </div>
      </NodeIdContext.Provider>
    </Show>
  );
};

export default NodeWrapper;
