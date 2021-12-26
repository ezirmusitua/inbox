export default function Container({ children }: any) {
  return (
    <div className="relative" style={{ width: "240px" }}>
      {children}
    </div>
  );
}

export function ContentContainer({ children }: any) {
  return (
    <div className="w-full p-4 flex flex-col item-center bg-white">
      {children}
    </div>
  );
}
