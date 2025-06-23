import React from "react";
import { Button } from "@material-ui/core";
import { APP } from "routes";
import { useRouter } from "next/router";

const mapTargetToURLBuilder = {
  profile: (id) => APP.TEAMS.replace(":teamId", id),
  user: (id) => APP.USERS.replace(":userId", id),
  board: (id) => APP.BOARDS.replace(":boardId", id),
  gameAccount: (id) => APP.GAME_ACCOUNTS.replace(":gameAccountId", id),
  gameSession: (id) => APP.GAME_SESSIONS.replace(":gameSessionId", id),
  ranking: (id) => APP.RANKINGS.replace(":rankingId", id),
  match: (id) => APP.MATCHES.replace(":matchId", id),
};

export const Navigable = ({
  button, children, disabled, to, id, entityId, justify, afterClick, ...rest
}) => {
  const router = useRouter();

  const onClick = () => {
    if (!disabled) {
      router.push(mapTargetToURLBuilder[to](entityId));
      if (afterClick) afterClick();
    }
  };
  if (button) {
    return (
      <Button
        style={{
          justifyContent: justify,
          textTransform: "unset",
          padding: 0,
          margin: 0,
        }}
        id={id}
        onClick={onClick}
      >
        {children}
      </Button>
    );
  }
  return React.cloneElement(children, {
    style: { cursor: "pointer" },
    onClick,
    id,
    ...rest,
  });
};
