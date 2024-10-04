export function ErrorHint({ script }: { script: string }) {
  return (
    <>
      <span>This may be due to the following script:</span>
      <br />
      <span className="font-bold">{script}</span>
    </>
  );
}