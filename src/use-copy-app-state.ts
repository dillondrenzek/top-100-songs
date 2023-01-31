import { AppState } from "./use-app-state";
import { useCallback, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";

export function useCopyAppState(state: AppState) {
  //
  // Copy to Clipboard

  const [, copyValue] = useCopyToClipboard();

  const [isCopied, setIsCopied] = useState(false);

  const handleClickCopy = useCallback(() => {
    copyValue(JSON.stringify(state));
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 10000);
  }, [copyValue, state]);

  return {
    isCopied,
    handleClickCopy,
  };
}
