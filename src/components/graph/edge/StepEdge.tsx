import { getSmoothStepPath } from "@xyflow/system";
import { type Component } from "solid-js";

import type { StepEdgeProps } from "@/shared/types";

import BaseEdge from "./BaseEdge";

const StepEdge: Component<StepEdgeProps> = (props) => {
  const pathData = () => {
    const [path, labelX, labelY] = getSmoothStepPath({
      sourceX: props.sourceX,
      sourceY: props.sourceY,
      targetX: props.targetX,
      targetY: props.targetY,
      sourcePosition: props.sourcePosition,
      targetPosition: props.targetPosition,
      borderRadius: 0,
      offset: props.pathOptions?.offset,
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

export default StepEdge;
