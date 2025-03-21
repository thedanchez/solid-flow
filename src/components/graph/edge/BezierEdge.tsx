import { getBezierPath } from "@xyflow/system";
import { type Component } from "solid-js";

import type { BezierEdgeProps } from "@/shared/types";

import BaseEdge from "./BaseEdge";

const BezierEdge: Component<BezierEdgeProps> = (props) => {
  const pathData = () => {
    const [path, labelX, labelY] = getBezierPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      sourcePosition: props.sourcePosition,
      targetPosition: props.targetPosition,
      curvature: props.pathOptions?.curvature,
    });

    return { path, labelX, labelY };
  };

  return (
    <BaseEdge
      id={props.id}
      path={pathData().path}
      labelX={pathData().labelX}
      labelY={pathData().labelY}
      label={props.label}
      labelStyle={props.labelStyle}
      markerStart={props.markerStart}
      markerEnd={props.markerEnd}
      interactionWidth={props.interactionWidth}
      style={props.style}
    />
  );
};

export default BezierEdge;
