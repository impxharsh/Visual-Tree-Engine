import React, { useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  useNodesState, 
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  Panel // For the search bar UI
} from 'reactflow';
import 'reactflow/dist/style.css';

import { initialTreeData } from './utils/initialData';
import { getLayoutedElements } from './utils/layout';
import TreeNode from './components/TreeNode';

const nodeTypes = {
  treeNode: TreeNode,
};

const VisualTreeEngine = () => {
  const { fitView } = useReactFlow();
  const [treeData, setTreeData] = useState(initialTreeData);
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Layout Calculation
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    return getLayoutedElements(treeData);
  }, [treeData]);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // 2. Interactive Handlers
  const handleToggle = useCallback((id) => {
    setTreeData((prevTree) => {
      const toggleRecursive = (node) => {
        if (node.id === id) return { ...node, expanded: !node.expanded };
        if (node.children) return { ...node, children: node.children.map(toggleRecursive) };
        return node;
      };
      return toggleRecursive(prevTree);
    });
  }, []);

  const handleAddNode = useCallback((parentId) => {
    setTreeData((prevTree) => {
      const addChildRecursive = (node) => {
        if (node.id === parentId) {
          const newChild = {
            id: `node-${Date.now()}`, 
            label: 'New Node',
            expanded: true,
            children: []
          };
          return { 
            ...node, 
            expanded: true, 
            children: [...(node.children || []), newChild] 
          };
        }
        if (node.children) return { ...node, children: node.children.map(addChildRecursive) };
        return node;
      };
      return addChildRecursive(prevTree);
    });
  }, []);

  // 3. Sync & Search Logic
  useEffect(() => {
    const nodesWithData = layoutedNodes.map((n) => {
      // Highlight logic for Search Bonus
      const isHighlighted = searchQuery && n.data.label.toLowerCase().includes(searchQuery.toLowerCase());
      
      return {
        ...n,
        data: { 
          ...n.data,
          onToggle: handleToggle,
          onAdd: handleAddNode,
          isHighlighted // Pass this to TreeNode.jsx for styling
        },
      };
    });

    setNodes(nodesWithData);
    setEdges(layoutedEdges);

  
    const timer = setTimeout(() => {
      fitView({ duration: 800, padding: 0.2 });
    }, 50);
    return () => clearTimeout(timer);
  }, [layoutedNodes, layoutedEdges, handleToggle, handleAddNode, fitView, searchQuery]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a1a' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
      >
        <Background color="#333" gap={20} />
        <Controls />
        
  
        <Panel position="top-right" style={{ background: '#2d2d3d', padding: '10px', borderRadius: '8px' }}>
          <input
            type="text"
            placeholder="Search nodes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '5px', borderRadius: '4px', border: 'none', outline: 'none' }}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};


export default function App() {
  return (
    <ReactFlowProvider>
      <VisualTreeEngine />
    </ReactFlowProvider>
  );
}