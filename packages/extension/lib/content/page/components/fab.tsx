import { Popover } from "@headlessui/react";
import { useContext } from "react";
import Context from "../context";
import { eReadingModeStage } from "../store";
import ModeSelector from "./mode_selector";
function Button({ onClick, label, bg }: any) {
  const className = [
    "py-2",
    "rounded-full",
    "h-12",
    "w-12",
    "shadow-md",
    `bg-${bg}-500`,
    "flex",
    "justify-center",
    "items-center",
    "cursor-pointer",
  ];
  return (
    <div className={className.join(" ")} onClick={onClick}>
      <span className="text-white">{label}</span>
    </div>
  );
}

export default function Fab() {
  const ctx = useContext(Context);
  const className = ["z-50", "fixed", "right-4", "bottom-1/2"];
  return (
    <div className={className.join(" ")}>
      <div className="py-1">
        <ModeSelector>
          <Button label="R" bg="green" onClick={null}></Button>
        </ModeSelector>
      </div>
      <div className="py-1">
        <Button
          label="E"
          bg="blue"
          onClick={() =>
            ctx.dispatch({
              type: "change_stage",
              payload: eReadingModeStage.EDITING,
            })
          }
        ></Button>
      </div>
    </div>
  );
}
