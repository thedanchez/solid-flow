import { type Context, onCleanup, type ParentProps } from "solid-js";

import { createSolidFlow } from "@/data/createSolidFlow";
import type { Edge, Node } from "@/shared/types";

import { SolidFlowContext, type SolidFlowContextValue } from "../contexts/flow";
import type { SolidFlowProps } from "./types";

const SolidFlowProvider = <NodeType extends Node = Node, EdgeType extends Edge = Edge>(
  props: ParentProps<Partial<SolidFlowProps<NodeType, EdgeType>>>,
) => {
  const solidFlow = createSolidFlow(props);

  onCleanup(() => {
    solidFlow.reset();
  });

  // Since we cannot pass generic type info at the point of context creation, we need to cast it here
  const ContextProvider = (
    SolidFlowContext as unknown as Context<SolidFlowContextValue<NodeType, EdgeType>>
  ).Provider;

  return <ContextProvider value={solidFlow}>{props.children}</ContextProvider>;
};

export default SolidFlowProvider;
