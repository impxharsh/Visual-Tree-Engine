const NODE_WIDTH = 160;
const NODE_HEIGHT = 60;
const HORIZONTAL_SPACING = 100;
const VERTICAL_SPACING = 150;

const calculateSubtreeWidth = (node) => {
  if (!node.children || node.children.length === 0 || !node.expanded) {
    node.subtreeWidth = NODE_WIDTH;
    return NODE_WIDTH;
  }

  const childrenWidth = node.children.reduce((acc, child) => {
    return acc + calculateSubtreeWidth(child);
  }, 0);

  const totalGaps = (node.children.length - 1) * HORIZONTAL_SPACING;
  node.subtreeWidth = Math.max(NODE_WIDTH, childrenWidth + totalGaps);
  return node.subtreeWidth;
};

const assignPositions = (node, x, y, nodes, edges) => {
  nodes.push({
    id: node.id,
    type: 'treeNode', 
    data: { 
      label: node.label, 
      isExpanded: node.expanded,
      hasChildren: node.children?.length > 0,
      id: node.id 
    },
    position: { x, y },
  });

  if (!node.children || node.children.length === 0 || !node.expanded) return;

  let currentX = x - node.subtreeWidth / 2;

  node.children.forEach((child) => {
    const childWidth = child.subtreeWidth;
    const childX = currentX + childWidth / 2; 
    
    edges.push({
      id: `e-${node.id}-${child.id}`,
      source: node.id,
      target: child.id,
      type: 'smoothstep', // Clean, right-angled lines
    });

    assignPositions(child, childX, y + VERTICAL_SPACING, nodes, edges);
    currentX += childWidth + HORIZONTAL_SPACING;
  });
};

export const getLayoutedElements = (treeData) => {
  const nodes = [];
  const edges = [];


  calculateSubtreeWidth(treeData);
  
  assignPositions(treeData, 0, 0, nodes, edges);

  return { nodes, edges };
};