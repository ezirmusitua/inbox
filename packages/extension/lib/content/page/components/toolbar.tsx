import { useContext } from "react";
import Context from "../context";
import { eActionType, eReadingModeStage } from "../store";

function Button({ label, onClick, bg }: any) {
  const className = [
    "_ibe-box-border",
    "_ibe-cursor-pointer",
    "_ibe-py-2",
    "_ibe-px-4",
    `_ibe-bg-${bg}-500`, // TODO: do not use concat
    "_ibe-hover:bg-opacity-70",
  ];
  return (
    <div className={className.join(" ")} onClick={onClick}>
      <span className="_ibe-text-md _ibe-text-white">{label}</span>
    </div>
  );
}
export default function Toolbar() {
  const ctx = useContext(Context);
  if (ctx.state.stage !== eReadingModeStage.EDITING) return null;
  return (
    <div className="_ibe-box-border _ibe-z-50 _ibe-fixed _ibe-top-0 _ibe-left-0 _ibe-right-0 _ibe-p-2 _ibe-flex _ibe-justify-end _ibe-bg-gray-800 _ibe-border-bottom _ibe-shadow-sm _ibe-shadow-gray-200">
      <Button
        label="Cancel"
        onClick={() =>
          ctx.dispatch({
            type: eActionType.CHANGE_STAGE,
            payload: eReadingModeStage.START,
          })
        }
        bg="gray"
      ></Button>
      <Button label="Save" onClick={() => {}} bg="green"></Button>
    </div>
  );
}
