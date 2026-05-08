import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const TreeNode = ({ data }) => {
  return (
    <div className={`tree-node-container ${data.isHighlighted ? 'highlighted' : ''}`}>

      <Handle type="target" position={Position.Top} />

      <div className="node-content">

        <div className="node-label">{data.label}</div>
        
        {data.hasChildren && (
          <button 
            className="toggle-button" 
            onClick={() => data.onToggle(data.id)}
          >
            {data.isExpanded ? '−' : '+'}
          </button>
        )}

      
      <button 
        className="add-button" 
        onClick={(e) => {
          e.stopPropagation(); 
          data.onAdd(data.id);
        }}
      >
        +
      </button>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
    
  );
};

export default memo(TreeNode);