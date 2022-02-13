import { Popover, RadioGroup } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
// @ts-ignore
import { usePopper } from "react-popper";
import Context from "../context";
import Service from "../service";
import { eActionType, eReadingModeStage } from "../store";

function ModeItem({ item, last }: any) {
  let className = [
    "_ibe-box-border",
    "_ibe-py-2",
    "_ibe-px-4",
    "_ibe-hover:bg-blue-500",
    "_ibe-w-max",
    "_ibe-cursor-pointer",
  ];
  if (!last) {
    className.push("_ibe-border-b-2");
    className.push("_ibe-border-gray-200");
  }
  return (
    <RadioGroup.Option value={item.id}>
      {({ checked }) => (
        <div
          className={[
            ...className,
            (checked && "_ibe-bg-blue-400") || "_ibe-bg-blue-300",
          ].join(" ")}
        >
          <span className="_ibe-text-white" style={{ minWidth: "120px" }}>
            {item.name}
          </span>
        </div>
      )}
    </RadioGroup.Option>
  );
}

function ModeList() {
  const ctx = useContext(Context);
  const [items, set_items] = useState([]);
  const service = new Service();
  useEffect(() => {
    const { items } = service.load_available_mode();
    set_items(items);
  }, []);
  return (
    <div className="_ibe-box-border _ibe-px-4">
      <RadioGroup
        className="_ibe-shadow-md _ibe-rounded-md _ibe-overflow-hidden"
        value={ctx.state.mode}
        onChange={(mode) => {
          service.use_reading_mode(mode);
          ctx.dispatch({ type: eActionType.CHANGE_MODE, payload: mode });
          ctx.dispatch({
            type: eActionType.CHANGE_STAGE,
            payload: eReadingModeStage.VIEWING,
          });
        }}
      >
        {items.map((item, index) => (
          <ModeItem
            key={index}
            item={item}
            last={items.length === index + 1}
          ></ModeItem>
        ))}
      </RadioGroup>
    </div>
  );
}

export default function ModeSelector({ children }: any) {
  const [trigger_element, set_trigger_element] = useState(null as any);
  const [popper_element, set_popper_element] = useState(null as any);
  const { styles, attributes } = usePopper(trigger_element, popper_element);
  return (
    <Popover className="_ibe-relative">
      <Popover.Button
        className="_ibe-border-none _ibe-px-0 _ibe-bg-transparent"
        ref={set_trigger_element}
      >
        {children}
      </Popover.Button>
      <Popover.Panel
        ref={set_popper_element}
        style={styles.popper}
        {...attributes}
      >
        <ModeList></ModeList>
      </Popover.Panel>
    </Popover>
  );
}
