/* eslint-disable react/prop-types */
import React, { useState, useMemo, useCallback, forwardRef, useRef, useImperativeHandle } from "react";
import { Pagination } from "@material-ui/lab";

import RemoteList from "./RemoteList";

const Paginator = (props, ref) => {
  const {
    endpoint,
    limit = 2,
    ...rest
  } = props;
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const listRef = useRef();
  const aggregatedEndpoint = useMemo(() => ({
    ...endpoint,
    url: `${endpoint.url}?page=${page - 1}&limit=${limit}`,
  }), [endpoint, page, limit]);

  const onChange = useCallback((data) => setPages(Math.ceil(data.count / limit)), [limit]);
   
  useImperativeHandle(ref, () => ({
    refresh: () => listRef.current.refresh(),
  }));

  return (
    <>
      <RemoteList
        ref={listRef}
        endpoint={aggregatedEndpoint}
        onChange={onChange}
        paginated
        {...rest}
      />
      <Pagination
        count={pages}
        page={page}
        onChange={(e, val) => setPage(val)}
        hidePrevButton
        shape="rounded"
      />
    </>
  );
};

export default forwardRef(Paginator);
