import { useContext } from "react";
import Context from "../context";
import { eReadingModeStage } from "../store";

function Button({ label, onClick, bg }: any) {
  const className = [
    "cursor-pointer",
    "py-2",
    "px-4",
    `bg-${bg}-500`,
    "hover:bg-opacity-70",
  ];
  return (
    <div className={className.join(" ")} onClick={onClick}>
      <span className="text-md text-white">{label}</span>
    </div>
  );
}
export default function Toolbar() {
  const ctx = useContext(Context);
  if (ctx.state.stage !== eReadingModeStage.EDITING) return null;
  return (
    <div className="z-50 fixed top-0 left-0 right-0 p-2 flex justify-end bg-gray-800 border-bottom shadow-sm shadow-gray-200">
      <Button
        label="Cancel"
        onClick={() =>
          ctx.dispatch({
            type: "change_stage",
            payload: eReadingModeStage.START,
          })
        }
        bg="gray"
      ></Button>
      <Button label="Save" onClick={() => {}} bg="green"></Button>
    </div>
  );
}
