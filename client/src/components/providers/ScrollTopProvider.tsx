import { useEffect, type FC } from "react";
import { useHistory } from "react-router-dom";

import type { WithChildren } from "utils/types";

type ScrollTopProviderProps = WithChildren<unknown>;

const ScrollTopProvider: FC<ScrollTopProviderProps> = ({ children }) => {
  const history = useHistory();

  useEffect(() => {
    const unlisten = history.listen(() => {
      const content = document.querySelector(".content");
      content?.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
    // eslint-disable-next-line
  }, []);

  return <>{children}</>;
};

export default ScrollTopProvider;
