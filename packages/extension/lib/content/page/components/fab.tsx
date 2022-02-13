import { useContext } from "react";
import Context from "../context";
import Service from "../service";
import { eActionType, eReadingModeStage } from "../store";
import ModeSelector from "./ModeSelector";

function Button({ onClick, label, bg }: any) {
  const className = [
    "_ibe-box-border",
    "_ibe-h-12",
    "_ibe-w-12",
    "_ibe-py-2",
    "_ibe-flex",
    "_ibe-justify-center",
    "_ibe-items-center",
    "_ibe-rounded-full",
    "_ibe-shadow-md",
    "_ibe-cursor-pointer",
  ];
  if (bg) {
    className.push(`_ibe-bg-${bg}-500`);
  } else {
    className.push("_ibe-bg-blue-500");
  }

  return (
    <div className={className.join(" ")} onClick={onClick}>
      <span className="_ibe-text-white">{label}</span>
    </div>
  );
}

export default function Fab() {
  const ctx = useContext(Context);
  const service = new Service();
  const className = [
    "_ibe-box-border",
    "_ibe-z-50",
    "_ibe-fixed",
    "_ibe-right-4",
    "_ibe-bottom-1/2",
  ];
  const in_reading_mode = ctx.state.stage === eReadingModeStage.VIEWING;
  return (
    <div className={className.join(" ")}>
      {!in_reading_mode && (
        <div className="_ibe-box-border _ibe-py-1">
          <ModeSelector>
            <div className="_ibe-bg-yellow-500 _ibe-rounded-full">
              <Button label="R" bg="yellow" onClick={null}></Button>
            </div>
          </ModeSelector>
        </div>
      )}
      {!in_reading_mode && (
        <div className="_ibe-box-border _ibe-py-1">
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
        <div className="_ibe-box-border _ibe-py-1">
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
