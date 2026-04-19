export default function notificationModal({ isOpen, onClose, type = "success", title, message }) {
  if (!isOpen) return null;

  const styles = {
    success: { color: "text-gray-600", btn: "bg-gray-600 hover:bg-gray-700" },
    error:   { color: "text-gray-500",   btn: "bg-gray-500 hover:bg-gray-600"     },
  };

  const { color, btn } = styles[type];

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <p className={`text-4xl mb-3 ${color}`}>{type === "success" ? "✓" : "✕"}</p>
        <h2 className={`text-lg font-semibold mb-1 ${color}`}>{title}</h2>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 rounded-lg text-white text-sm font-medium ${btn}`}
        >
          OK
        </button>
      </div>
    </div>
  );
}