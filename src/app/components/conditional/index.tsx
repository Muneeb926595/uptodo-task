import { ReactNode } from 'react';

export const Conditional = (props: {
  ifTrue: any;
  children: ReactNode;
  elseChildren?: ReactNode;
}): ReactNode | null => {
  let isTrue: boolean;
  if (typeof props.ifTrue === 'function') {
    isTrue = props.ifTrue();
  } else {
    isTrue = props.ifTrue;
  }

  if (isTrue) {
    return props.children;
  } else if (props.elseChildren) {
    return props.elseChildren;
  } else {
    return null;
  }
};
