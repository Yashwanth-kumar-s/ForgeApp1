import React, { useState, useEffect } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { view } from '@forge/bridge';

const View = () => {
  const [fieldValue, setFieldValue] = useState(null);

  useEffect(() => {
    view.getContext()
      .then((context) => {
        console.log('[View Component] Context:', context);
        console.log('[View Component] Field Value:', context.extension.fieldValue);
        setFieldValue(context.extension.fieldValue);
      })
      .catch((error) => {
        console.error('[View Component] Error fetching context:', error);
      });
  }, []);

  return <Text>{`${fieldValue || 'None'}`}</Text>;
};

ForgeReconciler.render(<View />);