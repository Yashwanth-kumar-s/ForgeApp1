import React, { useState, useEffect, useCallback } from 'react';
import ForgeReconciler, { Select } from '@forge/react';
import { CustomFieldEdit} from '@forge/react/jira';
import { invoke } from '@forge/bridge';
import { view } from '@forge/bridge';

const Edit = () => {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log('[Edit Component] Calling getUsers function...');
        const users = await invoke('getUsers');
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

    fetchUsers();
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