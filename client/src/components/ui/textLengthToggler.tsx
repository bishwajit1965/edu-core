import { useState } from "react";

interface TextLengthTogglerProps {
  text?: string;
  limit?: number;
}

const TextLengthToggler = ({
  text = "",
  limit = 100,
}: TextLengthTogglerProps) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const isTruncated = text.length > limit;
  const result =
    isTruncated && !showOriginal ? `${text.slice(0, limit)} ...` : text;

  return (
    <div>
      <span>{result}</span>
      {isTruncated && (
        <button
          type="button"
          onClick={() => setShowOriginal((current) => !current)}
          className="text-sm font-bold cursor-pointer hover:link"
        >
          {showOriginal ? "← Show less" : "Show more →"}
        </button>
      )}
    </div>
  );
};

export default TextLengthToggler;
