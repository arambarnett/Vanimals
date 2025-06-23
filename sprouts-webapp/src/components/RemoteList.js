import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import List from "@material-ui/core/List";
import useResource from "hooks/useResource";
import { Typography } from "@material-ui/core";

const RemoteList = ({ endpoint, paginated, onChange, Item, Skeleton, ...rest }, ref) => {
  const { data, mutate } = useResource(endpoint);
  const elements = data && (paginated ? data.rows : data);

  useEffect(() => {
    if (data && onChange) onChange(data);
  }, [data, onChange]);
  
  useImperativeHandle(ref, () => ({
    refresh: () => mutate(data),
  }));
  
  return (
    <List {...rest}>
      {data
        ? elements.map((item) => <Item key={item.id} {...item} />)
        : Array(3).fill().map(() => (Skeleton ? <Skeleton /> : null))}
      {data && !elements.length && (
        <Typography color="textSecondary">
          No results found
        </Typography>
      )}
    </List>
  );
};

export default forwardRef(RemoteList);
