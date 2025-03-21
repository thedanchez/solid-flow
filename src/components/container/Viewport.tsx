import type { ParentComponent } from "solid-js";

import { useFlowStore } from "@/components/contexts";

const Viewport: ParentComponent = (props) => {
  const { store } = useFlowStore();

  return (
    <div
      // TODO: Figure out why nodes disappear when we remove the xyflow__viewport class.
      class="solid-flow__container solid-flow__viewport xyflow__viewport"
      style={{
        transform: `translate(${store.viewport.x}px, ${store.viewport.y}px) scale(${store.viewport.zoom})`,
      }}
    >
      {props.children}
    </div>
  );
};

export default Viewport;
