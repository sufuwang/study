import { useState, useEffect } from 'react';
import styles from './index.module.less';

export default () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 500);
    return () => {
      clearInterval(id);
    };
  });
  return (
    <div className={styles.div}>{ count }</div>
  );
};
