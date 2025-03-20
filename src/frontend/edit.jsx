import React, { useState, useEffect, useCallback } from 'react';
import ForgeReconciler, { Select } from '@forge/react';
import { CustomFieldEdit } from '@forge/react/jira';
import { invoke, view } from '@forge/bridge';

const Edit = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);
  
  useEffect(() => {
    const fetchProjectContext = async () => {
      try {
        // Get project context from Jira UI
        const context = await view.getContext();
        const projectId = context.extension.project.id; // Fetch Project ID

        console.log(`Project ID from context: ${projectId}`);

        // Call resolver with project ID to fetch org users
        const users = await invoke('getUsers', { projectId });

        console.log('[Edit Component] Received users:', users);

        if (Array.isArray(users)) {
          const formattedOptions = users.map(user => ({
            label: user.displayName,
            value: user.accountId
          }));
          setOptions(formattedOptions);
        }
      } catch (error) {
        console.error('[Edit Component] Error fetching users:', error);
      }
    };

    fetchProjectContext();
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      await view.submit(value);
    } catch (e) {
      console.error('[Edit Component] Submit Error:', e);
    }
  }, [value]);

  return (
    <CustomFieldEdit onSubmit={onSubmit} hideActionButtons>
      <Select
        appearance="default"
        options={options}
        onChange={(e) => setValue(e.value)}
        isLoading={options.length === 0}
      />
    </CustomFieldEdit>
  );
};

ForgeReconciler.render(<Edit />);
