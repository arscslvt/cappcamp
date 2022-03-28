import React from "react";
import Library from "./Library";

export default function HomeComponents(props) {
  return (
    <div>
      <Library userId={props.user ? props.user.uid : null} />
    </div>
  );
}
