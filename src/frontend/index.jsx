import React, { useState, useEffect } from 'react';
import ForgeReconciler, { Text } from '@forge/react';
import { view } from '@forge/bridge';
impo

const View = () => {
  const [fieldValue, setFieldValue] = useState(null);

  useEffect(() => {
    view.getContext().then((context) => {
      console.log('[View Component] Field Value:', context.extension.fieldValue);
      setFieldValue(context.extension.fieldValue);
    });
  }, []);

  return <Text>{`Selected User: ${fieldValue || 'None'}`}</Text>;
};

ForgeReconciler.render(<View />);