import React from "react";

import { useModalsStore } from "./ModalsStore";

const ModalsStoreComponent = () => {
  const modals = useModalsStore((s) => s.modals);
  // const hasOpenModal = useMemo(() => modals.some((d) => d.open), [modals]);

  return (
    <>
      {modals.map(({ Component, open, key, params }) => (
        <Component
          key={key}
          visible={open}
          handleClose={() => useModalsStore.getState().closeModal(key)}
          {...params}
        />
      ))}
    </>
  );
};

export default ModalsStoreComponent;
