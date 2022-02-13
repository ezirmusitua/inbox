export default function Container({ children }: any) {
  return (
    <div className="_ibe-relative" style={{ width: "240px" }}>
      {children}
    </div>
  );
}

export function ContentContainer({ children }: any) {
  return (
    <div className="_ibe-w-full _ibe-p-4 _ibe-flex _ibe-flex-col _ibe-item-center _ibe-bg-white">
      {children}
    </div>
  );
}
