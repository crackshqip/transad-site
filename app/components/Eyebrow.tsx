type Props = {
  number?: number;
  accent?: boolean;
  children: React.ReactNode;
};

export default function Eyebrow({ number, accent = false, children }: Props) {
  return (
    <div className="eyebrow">
      {number != null && (
        <>
          <span className={accent ? "n n-accent" : "n"}>
            {String(number).padStart(2, "0")}
          </span>
          <span className="dash">—</span>
        </>
      )}
      <span>{children}</span>
    </div>
  );
}
