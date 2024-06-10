interface TokenPromptDialogProps {
  open: boolean;
  closeDialog: () => void;
}

export function TokenPromptDialog({ open, closeDialog }: TokenPromptDialogProps) {
  return (
    <dialog
      id="comfy-settings-dialog"
      style={{
        position: 'absolute',
        top: '50%',
        bottom: '50%'
      }}
      open={open}
    >
      <div className="comfy-modal-content">
        <h3>Sign In</h3>
      </div>

      <button type="button" style={{ cursor: 'pointer', width: '100%' }} onClick={closeDialog}>
        Close
      </button>
    </dialog>
  );
}
