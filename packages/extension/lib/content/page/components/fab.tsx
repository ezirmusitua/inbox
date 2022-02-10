import { useContext } from "react";
import Context from "../context";
import Service from "../service";
import { eActionType, eReadingModeStage } from "../store";
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

function save_article() {
  fetch("http://localhost:31312/api/article/temporary", {
    method: "POST",
    headers: {},
  });
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
