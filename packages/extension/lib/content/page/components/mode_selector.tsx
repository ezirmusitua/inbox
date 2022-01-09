import { Popover, RadioGroup } from "@headlessui/react";
import { useContext, useEffect, useState } from "react";
// @ts-ignore
import { usePopper } from "react-popper";
import Context from "../context";
import Service from "../service";

function ModeItem({ item, last }: any) {
  let className = [
    "py-2",
    "px-4",
    "hover:bg-blue-500",
    "w-max",
    "cursor-pointer",
  ];
  if (!last) {
    className.push("border-b-2");
    className.push("border-gray-200");
  }
  return (
    <RadioGroup.Option value={item.id}>
      {({ checked }) => (
        <div
          className={[
            ...className,
            (checked && "bg-blue-400") || "bg-blue-300",
          ].join(" ")}
        >
          <span className="text-white" style={{ minWidth: "120px" }}>
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
    <div className="px-4">
      <RadioGroup
        className="shadow-md rounded-md overflow-hidden"
        value={ctx.state.mode}
        onChange={(mode) => {
          service.use_reading_mode(mode);
          ctx.dispatch({ type: "change_mode", payload: mode });
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
    <Popover className="relative">
      <Popover.Button ref={set_trigger_element}>{children}</Popover.Button>
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
