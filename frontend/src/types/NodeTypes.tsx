import { NodeProps } from 'reactflow';
import { Square } from '../components/Square';
import { Cursor } from '../components/Cursor';
import { Reference } from '../components/Reference';

const NODE_TYPES = {
  square: (props: NodeProps<any>) => <Square data={props} />,
  cursor: (props: NodeProps<any>) => {
    const { color } = props.data;
    return <Cursor color={color}/>;
  },
  reference: (props: NodeProps<any>) => <Reference data={props.data} />
};

export { NODE_TYPES };