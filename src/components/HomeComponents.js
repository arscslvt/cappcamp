import React from "react";
import Library from "./Library";
import LatestNote from "./LatestNote";

export default function HomeComponents(props) {
  return (
    <div className="flex flex-col gap-8">
      <Library userId={props.user ? props.user.uid : null} />
      <LatestNote userId={props.user ? props.user.uid : null} />
    </div>
  );
}
