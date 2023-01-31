import { Stack, Button } from "@mui/material";
import React, { useCallback } from "react";
import { useToggle } from "usehooks-ts";
import { AppState } from "../use-app-state";
import { useCopyAppState } from "../use-copy-app-state";
import { ListSettings, SettingsModal } from "./song-list-page/settings-modal";

export function ControlPanel(props: {
  state: AppState;
  onSubmit: (values: ListSettings) => void;
}) {
  const { state, onSubmit } = props;

  const { handleClickCopy, isCopied } = useCopyAppState(state);

  const printState = useCallback(() => {
    console.log(state);
  }, [state]);

  //
  // Settings Modal

  const [isSettingsModalOpen, toggleSettingsModal] = useToggle(false);

  const handleSettingsModalSubmit = useCallback(
    (values: ListSettings) => {
      onSubmit(values);

      toggleSettingsModal();
    },
    [toggleSettingsModal, onSubmit]
  );

  return (
    <>
      <Stack direction="column" alignItems="stretch" spacing={1}>
        <Button variant="outlined" size="small" onClick={toggleSettingsModal}>
          Settings
        </Button>
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
      <SettingsModal
        onClose={toggleSettingsModal}
        onSubmit={handleSettingsModalSubmit}
        open={isSettingsModalOpen}
        state={state}
      />
    </>
  );
}
