export default function notificationModal({ isOpen, onClose, type = "success", title, message }) {
  if (!isOpen) return null;

  const styles = {
    success: { color: "text-gray-600", btn: "bg-gray-600 hover:bg-gray-700" },
    error:   { color: "text-gray-500",   btn: "bg-gray-500 hover:bg-gray-600"     },
  };

  const { color, btn } = styles[type];

  const handleKeyDown = (e) => {
    if (e.key === "Enter")
    {
      onClose();
    }
    if(e.key === "Tab")
    {
      e.preventDefault();
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[999] backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
      onKeyDown = {handleKeyDown}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <p className={`text-4xl mb-3 ${color}`}>{type === "success" ? "✓" : "✕"}</p> */}
        <h2 className={`text-xl font-semibold mb-1 ${color}`}>{title}</h2>
        <p className="text-lg text-gray-500 mb-5">{message}</p>
        <button
          onClick={onClose}
          className={`w-full py-2 rounded-lg text-white text-md font-medium ${btn}`}
        >
          OK
        </button>
      </div>
    </div>
  );
}