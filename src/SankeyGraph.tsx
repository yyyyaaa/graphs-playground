import { sankey, sankeyRight, sankeyLinkHorizontal } from "d3-sankey";

const MARGIN_Y = 25;
const MARGIN_X = 5;

type SankeyNode = {
  id: string;
};

type SankeyLink = {
  source: string;
  target: string;
  value: number;
};

type Data = {
  nodes: Array<SankeyNode>;
  links: Array<SankeyLink>;
};

// Layout:
// bob alice
// carol mel
// yan
export const demoData: Data = {
  nodes: [
    { id: "bob" },
    { id: "alice" },
    { id: "carol" },
    { id: "mel" },
    { id: "yan" },
  ],
  links: [
    { source: "bob", target: "alice", value: 4 },
    { source: "carol", target: "mel", value: 3 },
    { source: "carol", target: "alice", value: 1 },
    { source: "yan", target: "alice", value: 1 },
  ],
};

interface SankeyProps {
  width: number;
  height: number;
  data: Data;
}

export const SankeyGraph = (props: SankeyProps) => {
  if (!props.data) {
    return <div>Empty</div>;
  }

  const sankeyGenerator = sankey<SankeyNode, SankeyLink>() // TODO: find how to type the sankey() function
    .nodeWidth(10)
    .nodePadding(29)
    .extent([
      [MARGIN_X, MARGIN_Y],
      [props.width - MARGIN_X, props.height - MARGIN_Y],
    ])
    .nodeId((node: SankeyNode) => node.id) // Accessor function: how to retrieve the id that defines each node. This id is then used for the source and target props of links
    .nodeAlign(sankeyRight); // Algorithm used to decide node position

  // Compute nodes and links positions
  const { nodes, links } = sankeyGenerator(props.data);

  const allNodes = nodes.map((node) => {
    return (
      <g key={node.index}>
        <rect
          height={(node?.y1 ?? 0) - (node?.y0 ?? 0)}
          width={sankeyGenerator.nodeWidth()}
          x={node.x0}
          y={node.y0}
          stroke="#e4e4e7"
          fill="#f87171"
          fillOpacity={0.8}
          rx={4}
        />
      </g>
    );
  });

  //
  // Draw the links
  //
  const allLinks = links.map((link, i) => {
    const linkGenerator = sankeyLinkHorizontal();
    const path = linkGenerator(link);

    if (!path) return null;

    return (
      <path
        key={i}
        d={path}
        stroke="#a53253"
        fill="none"
        strokeOpacity={0.1}
        strokeWidth={link.width}
      />
    );
  });

  return (
    <div>
      <svg width={props.width} height={props.height}>
        {allNodes}
        {allLinks}
      </svg>
    </div>
  );
};
