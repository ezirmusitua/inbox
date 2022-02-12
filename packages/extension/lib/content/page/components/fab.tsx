import { useContext } from "react";
import Context from "../context";
import Service from "../service";
import { eActionType, eReadingModeStage } from "../store";
import ModeSelector from "./ModeSelector";

function Button({ onClick, label, bg }: any) {
  const className = [
    "h-12",
    "w-12",
    "py-2",
    "flex",
    "justify-center",
    "items-center",
    "rounded-full",
    "shadow-md",
    "cursor-pointer",
  ];
  if (bg) {
    className.push(`bg-${bg}-500`);
  } else {
    className.push("bg-blue-500");
  }

  return (
    <div className={className.join(" ")} onClick={onClick}>
      <span className="text-white">{label}</span>
    </div>
  );
}

export default function Fab() {
  const ctx = useContext(Context);
  const service = new Service();
  const className = ["z-50", "fixed", "right-4", "bottom-1/2"];
  const in_reading_mode = ctx.state.stage === eReadingModeStage.VIEWING;
  return (
    <div className={className.join(" ")}>
      {!in_reading_mode && (
        <div className="py-1">
          <ModeSelector>
            <div className="bg-yellow-500 rounded-full">
              <Button label="R" bg="yellow" onClick={null}></Button>
            </div>
          </ModeSelector>
        </div>
      )}
      {!in_reading_mode && (
        <div className="py-1">
          <Button
            label="E"
            bg="blue"
            onClick={() =>
              ctx.dispatch({
                type: eActionType.CHANGE_STAGE,
                payload: eReadingModeStage.EDITING,
              })
            }
          ></Button>
        </div>
      )}
      {in_reading_mode && (
        <div className="py-1">
          <Button
            label="S"
            bg="green"
            onClick={() => service.send_to_inbox(ctx.state.mode)}
          ></Button>
        </div>
      )}
    </div>
  );
}
