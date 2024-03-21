import { useEffect } from "react";

function Toast({ setToast, text }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      setToast(false);
    }, 1300);
    return () => {
      clearTimeout(timer);
    };
  }, [setToast]);

  return (
    <div>
        <div className="toast-cls shadow p-4">
            <p>{text}</p>
        </div>
    </div>
  );
}

export default Toast;