import React, { type FC, type PropsWithChildren, type ReactNode } from "react";

type AsyncComponentProps = PropsWithChildren<{
  loading: boolean;
  SkeletonComponent: ReactNode;
}>;

const AsyncComponent: FC<AsyncComponentProps> = ({
  loading,
  SkeletonComponent,
  children,
}) => {
  if (loading) {
    return <>{SkeletonComponent}</>;
  }

  return <>{children}</>;
};

export default AsyncComponent;
