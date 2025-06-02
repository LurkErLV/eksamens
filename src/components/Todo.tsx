import { useState } from "react";

export default function Todo({
  todo,
  handleRemovetask,
  index,
}: {
  todo: string;
  handleRemovetask: (index: number) => void;
  index: number;
}) {
  const [isCompleted, setIsCompleted] = useState(false);
  return (
    <>
      <div className="flex border rounded-lg p-2 items-center justify-center gap-2">
        <input
          type="checkbox"
          checked={isCompleted}
          onClick={() => setIsCompleted(!isCompleted)}
        ></input>
        <p className={`${isCompleted ? "line-through" : ""}`}>{todo}</p>
        <p
          onClick={() => handleRemovetask(index)}
          className="text-red-500 hover:text-red-700 cursor-pointer"
        >
          X
        </p>
      </div>
    </>
  );
}
