export const initialTreeData = {
  id: 'root',
  label: 'Root',
  expanded: true,
  children: [
    {
      id: 'A',
      label: 'A',
      expanded: true,
      children: [
        { id: 'A1', label: 'A1', children: [] },
        { id: 'A2', label: 'A2', children: [] },
      ],
    },
    {
      id: 'B',
      label: 'B',
      expanded: true,
      children: [
        { id: 'B1', label: 'B1', children: [] },
        { id: 'B2', label: 'B2', children: [] },
      ],
    },
  ],
};