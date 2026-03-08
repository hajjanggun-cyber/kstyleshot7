export default function Loading() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#0f0e0d",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          display: "block",
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid rgba(244,140,37,0.15)",
          borderTopColor: "#f48c25",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
