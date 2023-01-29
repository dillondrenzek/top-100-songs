import { Stack, Button } from "@mui/material";
import React, { useCallback, useState } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { AppState } from "../use-app-state";

export function ControlPanel(props: { state: AppState }) {
  const { state } = props;
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

  const printState = useCallback(() => {
    console.log(state);
  }, [state]);

  return (
    <Stack direction="column" alignItems="stretch" spacing={1}>
      <Button variant="outlined" size="small" onClick={printState}>
        Print to Console
      </Button>
      <Button
        variant="outlined"
        size="small"
        color={isCopied ? "success" : "primary"}
        onClick={handleClickCopy}
      >
        {isCopied ? "Copied!" : "Copy State"}
      </Button>
    </Stack>
  );
}
