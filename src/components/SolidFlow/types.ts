import type {
  ConnectionLineType,
  ConnectionMode,
  CoordinateExtent,
  IsValidConnection,
  NodeBase,
  NodeOrigin,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  OnMove,
  OnMoveEnd,
  OnMoveStart,
  PanelPosition,
  PanOnScrollMode,
  ProOptions,
  Viewport,
} from "@xyflow/system";
import type { JSX } from "solid-js";
import type { Store } from "solid-js/store";

import type {
  DefaultEdgeOptions,
  Edge,
  EdgeTypes,
  FitViewOptions,
  Node,
  NodeTypes,
  OnBeforeDelete,
  OnDelete,
} from "@/shared/types";
import type {
  GraphMultiTargetHandler,
  GraphTargetContextHandler,
  GraphTargetHandler,
  MouseOrTouchEventHandler,
} from "@/shared/types/events";

export type SolidFlowInitialProps = {
  readonly initialNodes: Node[];
  readonly initialEdges: Edge[];
  readonly initialWidth: number;
  readonly initialHeight: number;
  readonly fitView: boolean;
  readonly nodeOrigin: NodeOrigin;
};

type EventProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = {
  readonly onInit: () => void;
  readonly onEdgeCreate: (edge: EdgeType) => void;
  readonly onConnect: OnConnect;
  readonly onConnectStart: OnConnectStart;
  readonly onConnectEnd: OnConnectEnd;
  readonly onBeforeDelete: OnBeforeDelete<NodeType, EdgeType>;
  readonly onError: (error: Error) => void;
  readonly onDelete: OnDelete;
  readonly onMove: OnMove;
  readonly onMoveStart: OnMoveStart;
  readonly onMoveEnd: OnMoveEnd;
  readonly onPaneClick: MouseOrTouchEventHandler;
  readonly onPaneContextMenu: MouseOrTouchEventHandler;
  readonly isValidConnection: IsValidConnection;

  readonly onNodeClick: GraphTargetHandler<NodeType>;
  readonly onNodeContextMenu: GraphTargetHandler<NodeType>;
  readonly onNodeMouseEnter: GraphTargetHandler<NodeType>;
  readonly onNodeMouseLeave: GraphTargetHandler<NodeType>;
  readonly onNodeMouseMove: GraphTargetHandler<NodeType>;
  readonly onNodeDrag: GraphTargetContextHandler<NodeBase>;
  readonly onNodeDragStart: GraphTargetContextHandler<NodeBase>;
  readonly onNodeDragStop: GraphTargetContextHandler<NodeBase>;
  readonly onNodeSelectionContextMenu?: GraphMultiTargetHandler<NodeType>;
  readonly onNodeSelectionClick?: GraphMultiTargetHandler<NodeType>;

  readonly onEdgeClick: GraphTargetHandler<EdgeType>;
  readonly onEdgeContextMenu: GraphTargetHandler<EdgeType>;
  readonly onEdgeMouseEnter: GraphTargetHandler<EdgeType>;
  readonly onEdgeMouseLeave: GraphTargetHandler<EdgeType>;
  readonly onEdgeMouseMove: GraphTargetHandler<EdgeType>;
};

export type SolidFlowProps<NodeType extends Node = Node, EdgeType extends Edge = Edge> = EventProps<
  NodeType,
  EdgeType
> & {
  readonly id: string;
  readonly class: string;
  readonly style: JSX.CSSProperties;
  readonly colorMode: "light" | "dark";
  readonly defaultMarkerColor: string;
  /** The nodes to render. **Must** be a SolidJS store from `createStore`. */
  readonly nodes: Store<NodeType[]>;
  readonly nodeTypes: NodeTypes;
  /** The edges to render. **Must** be a SolidJS store from `createStore`. */
  readonly edges: Store<EdgeType[]>;
  readonly edgeTypes: EdgeTypes;
  readonly nodeOrigin: NodeOrigin;
  readonly viewport: Viewport;
  readonly initialViewport: Viewport;
  readonly width: number;
  readonly height: number;
  readonly minZoom: number;
  readonly maxZoom: number;
  readonly fitView: boolean;
  readonly fitViewOptions: FitViewOptions;
  readonly paneClickDistance: number;
  readonly nodeClickDistance: number;
  readonly selectionKey: string;
  readonly selectionMode: string;
  readonly panActivationKey: string;
  readonly multiSelectionKey: string;
  readonly zoomActivationKey: string;
  readonly nodesDraggable: boolean;
  readonly nodesConnectable: boolean;
  readonly nodeDragThreshold: number;
  readonly elementsSelectable: boolean;
  readonly snapGrid: [number, number];
  readonly deleteKey: string;
  readonly connectionRadius: number;
  readonly connectionMode: ConnectionMode;
  readonly connectionLineType: ConnectionLineType;
  readonly connectionLineStyle: string;
  readonly connectionLineContainerStyle: string;
  readonly connectionLineContent: JSX.Element;
  readonly translateExtent: CoordinateExtent;
  readonly nodeExtent: CoordinateExtent;
  readonly onlyRenderVisibleElements: boolean;
  readonly panOnScrollMode: PanOnScrollMode;
  readonly preventScrolling: boolean;
  readonly zoomOnScroll: boolean;
  readonly zoomOnDoubleClick: boolean;
  readonly zoomOnPinch: boolean;
  readonly panOnScroll: boolean;
  readonly panOnDrag: boolean | number[];
  readonly selectionOnDrag: boolean;
  readonly autoPanOnConnect: boolean;
  readonly autoPanOnNodeDrag: boolean;
  readonly attributionPosition: PanelPosition;
  readonly proOptions: ProOptions;
  readonly defaultEdgeOptions: DefaultEdgeOptions;
  readonly children: JSX.Element;
};
